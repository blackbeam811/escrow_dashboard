// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Escrow
{
	// ********************************************************************** //
	//                                 Events                                 //
	// ********************************************************************** //
	event SingleOfferCreated(
		uint256 indexed offer_id,
		address indexed asset_owner,
		address indexed asset_address,
		uint256 amount,
		uint256 num_chunks,
		uint256 chunk_size,
		Asset equivalent_asset
	);

	event MultipleOfferCreated(
		uint256 indexed offer_id,
		address indexed asset_owner,
		address indexed asset_address,
		uint256 amount,
		uint256 num_chunks,
		uint256 chunk_size,
		Asset[] equivalent_assets
	);

	event OfferUpdated(
		uint256 offer_id,
		address address_of_asset_to_update,
		uint256 new_chunk_size
	);

	event OfferAccepted(
		uint256 offer_id,
		address taker,
		uint256 accepted_amount,
		address accepted_address,
		uint256 amount_purchased,
		uint256 remaining_in_offer
	);

	event BalanceAdded(
		address user_address,
		uint256 amount_added,
		uint256 new_balance
	);

	event BalanceWithdrawn(
		address user_address,
		uint256 amount_withdrawn
	);

	event RevenueGenerated(
		uint256 offer_id,
		address user_address,
		address asset_address,
		uint256 asset_amount
	);

	event UserGroupCreated(
		uint256 group_id,
		bool creator_included,
		address creator,
		address[] members
	);

	event UserGroupAdded(uint256 offer_id, uint256 user_group_id);
	event UserGroupRemoved(uint256 offer_id);
	event OfferCancelled(uint256 offer_id);
	event OfferPartiallyCancelled(uint256 offer_id, address asset_address);
	event OfferComplete(uint256 offer_id);

	// ********************************************************************** //
	//                                 Structs                                //
	// ********************************************************************** //
	struct Asset
	{
		uint256 chunk_size;
		address asset_address;
	}

	struct Offer
	{
		address owner;
		uint256 amount;
		Asset owned_asset;
		Asset[] requested_assets;
	}

	// ********************************************************************** //
	//                                 Storage                                //
	// ********************************************************************** //
	uint256 constant public platform_fee_decimals = 4;
	uint256 constant public platform_fee_decimal_factor = 10**platform_fee_decimals;

	uint256 public total_offers = 0;
	uint256 public platform_fee = 50;

	mapping(address => uint256) public user_coin_balances;
	mapping(uint256 => uint256) public offer_include_groups;
	mapping(address => bool)[] public user_groups;
	mapping(address => uint256) public platform_revenue;

	mapping(uint256 => Offer) private offers;

	constructor()
	{
		user_groups.push();
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                             Offer Creation                             //
	// ********************************************************************** //
	// ********************************************************************** //

	function create_single_coin_offer(
		Asset calldata equivalent_asset,
		uint256 num_chunks) external payable
	returns (uint256)
	{
		revert_if_coins_not_sent();
		revert_if_no_chunks(num_chunks);

		return single_offer_creation_helper(
			msg.value,
			Asset(msg.value / num_chunks, address(0)),
			equivalent_asset,
			num_chunks
		);
	}

	function create_multi_coin_offer(
		Asset[] calldata equivalent_assets,
		uint256 num_chunks) external payable
	returns (uint256)
	{
		revert_if_coins_not_sent();
		revert_if_no_chunks(num_chunks);

		return multiple_offer_creation_helper(
			msg.value,
			Asset(msg.value / num_chunks, address(0)),
			equivalent_assets,
			num_chunks
		);
	}

	function create_single_token_offer(
		Asset calldata equivalent_asset,
		uint256 num_chunks,
		uint256 held_asset_amount,
		address held_asset_address) external
	returns (uint256 offer_id)
	{
		revert_if_tokens_not_offered(held_asset_amount);
		revert_if_no_chunks(num_chunks);

		offer_id = single_offer_creation_helper(
			held_asset_amount,
			Asset(held_asset_amount / num_chunks, held_asset_address),
			equivalent_asset,
			num_chunks
		);

		transfer_token(
			held_asset_address,
			msg.sender,
			address(this),
			held_asset_amount
		);
	}

	function create_multi_token_offer(
		Asset[] calldata equivalent_assets,
		uint256 num_chunks,
		uint256 held_asset_amount,
		address held_asset_address) external
	returns (uint256 offer_id)
	{
		revert_if_tokens_not_offered(held_asset_amount);
		revert_if_no_chunks(num_chunks);

		offer_id = multiple_offer_creation_helper(
			held_asset_amount,
			Asset(held_asset_amount / num_chunks, held_asset_address),
			equivalent_assets,
			num_chunks
		);

		transfer_token(
			held_asset_address,
			msg.sender,
			address(this),
			held_asset_amount
		);
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                            Accepting Offers                            //
	// ********************************************************************** //
	// ********************************************************************** //

	function accept_single_offer_with_coins(uint256 offer_id) external payable
	{
		revert_if_not_eligible_to_accept_offer(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_single_offer(offer);

		verify_asset_at_index(0, address(0), offer);

		bool offer_concluded =
			accept_coins_helper(offer_id, offer.requested_assets[0]);

		if (offer_concluded)
		{
			delete offers[offer_id];
			emit OfferComplete(offer_id);
		}
	}

	function accept_single_offer_with_tokens(uint256 offer_id, uint256 num_tokens) external
	{
		revert_if_not_eligible_to_accept_offer(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_single_offer(offer);

		bool offer_concluded =
			accept_tokens_helper(num_tokens, offer_id, offer.requested_assets[0]);

		if (offer_concluded)
		{
			delete offers[offer_id];
			emit OfferComplete(offer_id);
		}
	}

	function accept_multi_offer_with_coins(uint256 offer_id, uint256 asset_index) external payable
	{
		revert_if_not_eligible_to_accept_offer(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_multiple_offer(offer);

		verify_asset_at_index(asset_index, address(0), offer);

		bool offer_concluded =
			accept_coins_helper(offer_id, offer.requested_assets[asset_index]);

		if (offer_concluded)
		{
			delete offers[offer_id];
			emit OfferComplete(offer_id);
		}
	}

	function accept_multi_offer_with_tokens(
		uint256 offer_id,
		uint256 asset_index,
		address address_of_asset_to_accept,
		uint256 num_tokens) external
	{
		revert_if_not_eligible_to_accept_offer(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_multiple_offer(offer);

		verify_asset_at_index(asset_index, address_of_asset_to_accept, offer);

		bool offer_concluded =
			accept_tokens_helper(num_tokens, offer_id, offer.requested_assets[asset_index]);

		if (offer_concluded)
		{
			delete offers[offer_id];
			emit OfferComplete(offer_id);
		}
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                            Canceling Offers                            //
	// ********************************************************************** //
	// ********************************************************************** //

	function cancel_offer(uint256 offer_id) external
	{
		revert_if_offer_id_out_of_range(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_creator(offer);

		Asset storage owned_asset = offer.owned_asset;

		address asset_address = owned_asset.asset_address;
		uint256 asset_amount = offer.amount;

		if (asset_address == address(0))
		{
			payable(msg.sender).transfer(asset_amount);
		}
		else
		{
			transfer_token(asset_address, msg.sender, asset_amount);
		}

		delete offers[offer_id];

		emit OfferCancelled(offer_id);
	}

	function cancel_multi_offer_part(
		uint256 offer_id,
		uint256 asset_index,
		address address_of_asset_to_cancel) external
	{
		revert_if_offer_id_out_of_range(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_creator(offer);
		revert_if_not_multiple_offer(offer);

		Asset storage asset_storage_to_overwrite = verify_asset_at_index(
			asset_index,
			address_of_asset_to_cancel,
			offer
		);

		Asset[] storage requested_assets = offer.requested_assets;
		Asset storage asset_to_move = requested_assets[requested_assets.length - 1];

		asset_storage_to_overwrite.chunk_size = asset_to_move.chunk_size;
		asset_storage_to_overwrite.asset_address = asset_to_move.asset_address;

		requested_assets.pop();

		emit OfferPartiallyCancelled(
			offer_id,
			address_of_asset_to_cancel
		);
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                          Creating User Groups                          //
	// ********************************************************************** //
	// ********************************************************************** //

	function create_user_group(bool include_self, address[] calldata members) external
	{
		uint256 group_id = user_groups.length;
		uint256 num_members = members.length;

		require(
			num_members > 0,
			"A user group must contain users"
		);

		mapping(address => bool) storage new_group_storage = user_groups.push();

		for (uint256 i = 0; i < num_members;)
		{
			new_group_storage[members[i]] = true;

			unchecked { i += 1; }
		}

		if (include_self) { new_group_storage[msg.sender] = true; }

		emit UserGroupCreated(
			group_id,
			include_self,
			msg.sender,
			members
		);
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                             Updating Offers                            //
	// ********************************************************************** //
	// ********************************************************************** //

	function update_single_offer_chunk_size(
		uint256 offer_id,
		uint256 new_chunk_size) external
	{
		revert_if_offer_id_out_of_range(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_creator(offer);
		revert_if_not_single_offer(offer);
		revert_if_chunk_size_not_set(new_chunk_size);

		offer.requested_assets[0].chunk_size = new_chunk_size;

		emit OfferUpdated(
			offer_id,
			offer.requested_assets[0].asset_address,
			new_chunk_size
		);
	}

	function update_multi_offer_chunk_size(
		uint256 offer_id,
		uint256 asset_index,
		address address_of_asset_to_update,
		uint256 new_chunk_size) external
	{
		revert_if_offer_id_out_of_range(offer_id);
		revert_if_chunk_size_not_set(new_chunk_size);

		Offer storage offer = offers[offer_id];

		revert_if_not_creator(offer);
		revert_if_not_multiple_offer(offer);

		Asset storage asset_to_update = verify_asset_at_index(
			asset_index,
			address_of_asset_to_update,
			offer
		);

		asset_to_update.chunk_size = new_chunk_size;

		emit OfferUpdated(
			offer_id,
			address_of_asset_to_update,
			new_chunk_size
		);
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                              Whitelisting                              //
	// ********************************************************************** //
	// ********************************************************************** //

	function add_include_group(uint256 offer_id, uint256 user_group_id) external
	{
		revert_if_offer_id_out_of_range(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_creator(offer);

		require(
			user_group_id != 0 && user_group_id < user_groups.length,
			"Group ID is invalid"
		);

		offer_include_groups[offer_id] = user_group_id;

		emit UserGroupAdded(offer_id, user_group_id);
	}

	function remove_include_group(uint256 offer_id) external
	{
		revert_if_offer_id_out_of_range(offer_id);

		Offer storage offer = offers[offer_id];

		revert_if_not_creator(offer);

		offer_include_groups[offer_id] = 0;

		emit UserGroupRemoved(offer_id);
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                            Withdrawing Coins                           //
	// ********************************************************************** //
	// ********************************************************************** //

	function withdraw_coins() external
	{
		uint256 amount = user_coin_balances[msg.sender];

		user_coin_balances[msg.sender] = 0;

		emit BalanceWithdrawn(msg.sender, amount);

		payable(msg.sender).transfer(amount);
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                          Accessors and Queries                         //
	// ********************************************************************** //
	// ********************************************************************** //

	function read_offer(uint256 offer_id) external view
	returns (Offer memory)
	{
		Offer memory offer = offers[offer_id];

		return offer;
	}

	function is_user_in_group(uint256 user_group_id, address user) external view
	returns (bool)
	{
		require(
		   	user_group_id < user_groups.length,
			"Invalid group ID"
		);

		return user_groups[user_group_id][user];
	}

	// ********************************************************************** //
	// ********************************************************************** //
	//                             Private Helpers                            //
	// ********************************************************************** //
	// ********************************************************************** //

	// ********************************************************************** //
	//                            Creating Offers                             //
	// ********************************************************************** //
	function single_offer_creation_helper(
		uint256 held_asset_amount,
		Asset memory held_asset,
		Asset memory equivalent_asset,
		uint256 num_chunks) private
	returns (uint256)
	{
		held_asset.chunk_size = held_asset_amount / num_chunks;

		(uint256 offer_id, Offer storage offer) =
			offer_creation_helper(held_asset_amount, held_asset, num_chunks);

		require(
			equivalent_asset.asset_address != held_asset.asset_address,
			"The accepted currency cannot be the same as the offered currency"
		);
		require(
			equivalent_asset.chunk_size != 0,
			"A value for the asset to accept must be set"
		);

		equivalent_asset.chunk_size = equivalent_asset.chunk_size;

		offer.requested_assets.push(equivalent_asset);

		emit SingleOfferCreated(
			offer_id,
			msg.sender,
			held_asset.asset_address,
			held_asset_amount,
			num_chunks,
			held_asset.chunk_size,
			equivalent_asset
		);

		return offer_id;
	}

	function multiple_offer_creation_helper(
		uint256 held_asset_amount,
		Asset memory held_asset,
		Asset[] memory equivalent_assets,
		uint256 num_chunks) private
	returns (uint256)
	{
		held_asset.chunk_size = held_asset_amount / num_chunks;

		(uint256 offer_id, Offer storage offer) =
			offer_creation_helper(held_asset_amount, held_asset, num_chunks);

		uint256 num_equivalent_assets = equivalent_assets.length;

		require(
			num_equivalent_assets > 1,
			"Must provide an asset to accept for trade"
		);

		Asset[] storage requested_assets = offer.requested_assets;

		for (uint256 i = 0; i < num_equivalent_assets;)
		{
			Asset memory equivalent_asset = equivalent_assets[i];

			require(
				equivalent_asset.asset_address != held_asset.asset_address,
				"The accepted currency cannot be the same as the offered currency"
			);

			require(
				equivalent_asset.chunk_size != 0,
				"A value for the asset to accept must be set"
			);

			equivalent_asset.chunk_size = equivalent_asset.chunk_size;

			requested_assets.push(equivalent_asset);

			unchecked { i += 1; }
		}

		emit MultipleOfferCreated(
			offer_id,
			msg.sender,
			held_asset.asset_address,
			held_asset_amount,
			num_chunks,
			held_asset.chunk_size,
			equivalent_assets
		);

		return offer_id;
	}

	function offer_creation_helper(
		uint256 held_asset_amount,
		Asset memory held_asset,
		uint256 num_chunks) private
	returns (uint256, Offer storage)
	{
		total_offers += 1;
		uint256 offer_id = total_offers;

		uint256 revenue = (held_asset_amount * platform_fee) / platform_fee_decimal_factor;

		platform_revenue[held_asset.asset_address] += revenue;

		uint256 remainder_to_sell = held_asset_amount - revenue;

		Offer storage offer = offers[offer_id];

		offer.owner = msg.sender;
		offer.amount = remainder_to_sell;
		offer.owned_asset.chunk_size = remainder_to_sell / num_chunks;
		offer.owned_asset.asset_address = held_asset.asset_address;

		emit RevenueGenerated(
			offer_id,
			msg.sender,
			held_asset.asset_address,
			revenue
		);

		return (offer_id, offer);
	}

	function verify_asset_at_index(
		uint256 asset_index,
		address expected_asset,
		Offer storage offer) private view
	returns (Asset storage)
	{
		Asset[] storage requested_assets = offer.requested_assets;

		require(
			asset_index < requested_assets.length,
			"Asset ID is invalid"
		);

		Asset storage asset = requested_assets[asset_index];

		require(
			asset.asset_address == expected_asset,
			"The wrong asset or index was specified"
		);

		return asset;
	}

	// ********************************************************************** //
	//                            Accepting Offers                            //
	// ********************************************************************** //
	function accept_coins_helper(
		uint256 offer_id,
		Asset storage accepting_asset) private
	returns (bool)
	{
		(
			uint256 amount_purchased,
			uint256 revenue,
			bool is_offer_complete,
			Offer storage offer
		) = update_offer(msg.value, offer_id, accepting_asset);

		Asset storage offered_asset = offer.owned_asset;

		user_coin_balances[offer.owner] += (msg.value - revenue);
		transfer_token(offered_asset.asset_address, msg.sender, amount_purchased);

		emit BalanceAdded(msg.sender, msg.value - revenue, user_coin_balances[offer.owner]);

		return is_offer_complete;
	}

	function accept_tokens_helper(
		uint256 tokens_for_accepting_offer,
		uint256 offer_id,
		Asset storage accepting_asset) private
	returns (bool)
	{
		(
			uint256 amount_purchased,
			uint256 revenue,
			bool is_offer_complete,
			Offer storage offer
		) = update_offer(tokens_for_accepting_offer, offer_id, accepting_asset);

		Asset storage offered_asset = offer.owned_asset;

		if (offered_asset.asset_address == address(0))
		{
			// swapping tokens for coins
			payable(msg.sender).transfer(amount_purchased);
		}
		else
		{
			// swapping tokens for tokens
			transfer_token(offered_asset.asset_address, msg.sender, amount_purchased);
		}

		transfer_token(
			accepting_asset.asset_address,
			msg.sender,
			offer.owner,
			tokens_for_accepting_offer - revenue
		);
		transfer_token(
			accepting_asset.asset_address,
			msg.sender,
			address(this),
			revenue
		);

		return is_offer_complete;
	}

	function update_offer(
		uint256 accepter_asset_amount,
		uint256 offer_id,
		Asset storage accepter_asset) private
	returns (
		uint256 amount_purchased,
		uint256 revenue,
		bool is_offer_complete,
		Offer storage offer)
	{
		offer = offers[offer_id];

		uint256 max_to_buy = offer.amount;

		uint256 max_to_sell =
			accepter_asset.chunk_size * (max_to_buy / offer.owned_asset.chunk_size);

		require(
			accepter_asset_amount > 0,
			"An asset must be sent to trade"
		);
		require(
			accepter_asset_amount <= max_to_sell,
			"Too much of the requested asset was sent"
		);

		revenue = (accepter_asset_amount * platform_fee) / platform_fee_decimal_factor;
		platform_revenue[accepter_asset.asset_address] += revenue;

		emit RevenueGenerated(
			offer_id,
			msg.sender,
			accepter_asset.asset_address,
			revenue
		);

		if (accepter_asset_amount == max_to_sell)
		{
			amount_purchased = max_to_buy;
			offer.amount = 0;

			emit OfferAccepted(
				offer_id,
				msg.sender,
				accepter_asset_amount,
				accepter_asset.asset_address,
				amount_purchased,
				0
			);

			return (amount_purchased, revenue, true, offer);
		}

		// the buyer is not purchasing the entire amount, so determin how much
		// of the offered asset to purchase

		uint256 accepter_chunk_size = accepter_asset.chunk_size;

		require(
			accepter_asset_amount % accepter_chunk_size == 0,
			"You can only buy the asset in chunks"
		);

		// formula rearranged from
		// =>  (accepter_asset_amount / accepter_chunk_size) * offer.owned_asset.chunk_size
		// to decreasing errors due to truncation
		amount_purchased =
			(accepter_asset_amount * offer.owned_asset.chunk_size)
			/ accepter_chunk_size;
		offer.amount -= amount_purchased;

		emit OfferAccepted(
			offer_id,
			msg.sender,
			accepter_asset_amount,
			accepter_asset.asset_address,
			amount_purchased,
			offer.amount
		);

		return (amount_purchased, revenue, false, offer);
	}

	// ********************************************************************** //
	//                             Asset Transfers                            //
	// ********************************************************************** //
	function transfer_token(address token, address to, uint256 amount) private
	{
		require(
			IERC20(token).transfer(to, amount),
			"Token transfer failed"
		);
	}

	function transfer_token(address token, address from, address to, uint256 amount) private
	{
		require(
			IERC20(token).transferFrom(from, to, amount),
			"Token transfer failed"
		);
	}

	// ********************************************************************** //
	//                              Restrictions                              //
	// ********************************************************************** //
	function revert_if_coins_not_sent() private view
	{
		require(
			msg.value != 0,
			"Expected native coins to be sent"
		);
	}

	function revert_if_tokens_not_offered(uint256 tokens_offered) private pure
	{
		require(
			tokens_offered != 0,
			"Expected tokens to be offered"
		);
	}

	function revert_if_offer_id_out_of_range(uint256 offer_id) private view
	{
		require(
			offer_id > 0 && offer_id <= total_offers,
			"Offer ID is invalid"
		);
	}

	function revert_if_no_chunks(uint256 num_chunks) private pure
	{
		require(
			num_chunks != 0,
			"The number of chunks to sell must be at least 1"
		);
	}

	function revert_if_chunk_size_not_set(uint256 chunk_size) private pure
	{
		require(
			chunk_size != 0,
			"The chunk size is not set"
		);
	}

	function revert_if_not_creator(Offer storage offer) private view
	{
		require(
			msg.sender == offer.owner,
			"Only the creator can edit an offer"
		);
	}

	function revert_if_not_single_offer(Offer storage offer) private view
	{
		require(
			offer.requested_assets.length == 1,
			"The offer must contain exactly 1 value"
		);
	}

	function revert_if_not_multiple_offer(Offer storage offer) private view
	{
		require(
			offer.requested_assets.length > 1,
			"The offer must contain more than 1 value"
		);
	}

	function revert_if_coins_not_expected(Offer storage offer, uint256 asset_index) private view
	{
		require(
			offer.requested_assets[asset_index].asset_address == address(0),
			"The native coin was not expected"
		);
	}

	function revert_if_not_eligible_to_accept_offer(uint256 offer_id) private view
	{
		revert_if_offer_id_out_of_range(offer_id);

		if (offer_include_groups[offer_id] != 0)
		{
			require(
				user_groups[offer_id][msg.sender],
				"This offer is private"
			);
		}
	}
}
