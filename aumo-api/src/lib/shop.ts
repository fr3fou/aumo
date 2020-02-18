import axios from 'axios';
import { MessageResponse, Shop, ShopOwner } from './aumo';
import { withAuth } from './axios';
import { options } from './config';

export async function getAllShops(cookie?: string): Promise<Shop[]> {
  return (await axios.get(`${options.Backend}/shops`, withAuth(cookie))).data;
}

export async function getShop(id: number, cookie?: string): Promise<Shop> {
  return (await axios.get(`${options.Backend}/shops/${id}`, withAuth(cookie)))
    .data;
}

export async function edit(shop: Shop, cookie?: string): Promise<Shop> {
  return (
    await axios.put(
      `${options.Backend}/shops/${shop.shop_id}`,
      shop,
      withAuth(cookie)
    )
  ).data;
}

export async function create(
  shop: CreateRequest,
  cookie?: string
): Promise<Shop> {
  return (await axios.post(`${options.Backend}/shops`, shop, withAuth(cookie)))
    .data;
}

export async function addOwner(
  shopOwner: ShopOwner,
  cookie?: string
): Promise<MessageResponse> {
  return (
    await axios.post(
      `${options.Backend}/shops/${shopOwner.shop_id}/add-owner`,
      shopOwner,
      withAuth(cookie)
    )
  ).data;
}

export async function removeOwner(
  shopOwner: ShopOwner,
  cookie?: string
): Promise<MessageResponse> {
  return (
    await axios.post(
      `${options.Backend}/shops/${shopOwner.shop_id}/remove-owner`,
      shopOwner,
      withAuth(cookie)
    )
  ).data;
}

interface CreateRequest {
  name: string;
  image: string;
}

export default {
  getAllShops,
  getShop,
  edit,
  create,
  addOwner,
  removeOwner
};