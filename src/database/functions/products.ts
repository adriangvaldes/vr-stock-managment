import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export type ProductsType = {
  id: string,
  name: string,
  price: string,
  category: string,
  subCategory: string,
  imageUrl: string,
  code: string,
  description: string,
}

export async function getProducts(): Promise<ProductsType[]> {
  const productsRef = collection(db, "products");
  const productsSnapshot = await getDocs(productsRef);
  const products = productsSnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) as ProductsType[]
  return products
}
