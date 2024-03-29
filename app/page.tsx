import Image from "next/image";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";

// 疑似データ
// const books = [
//   {
//     id: 1,
//     title: "Book 1",
//     thumbnail: "/thumbnails/discord-clone-udemy.png",
//     price: 1980,
//     author: {
//       id: 1,
//       name: "Author 1",
//       description: "Author 1 description",
//       profile_icon: "https://source.unsplash.com/random/2",
//     },
//     content: "Content 1",
//     created_at: new Date().toString(),
//     updated_at: new Date().toString(),
//   },
//   {
//     id: 2,
//     title: "Book 2",
//     thumbnail: "/thumbnails/notion-udemy.png",
//     price: 2980,
//     author: {
//       id: 2,
//       name: "Author 2",
//       description: "Author 2 description",
//       profile_icon: "https://source.unsplash.com/random/3",
//     },
//     content: "Content 2",
//     created_at: new Date().toString(),
//     updated_at: new Date().toString(),
//   },
//   {
//     id: 3,
//     title: "Book 3",
//     thumbnail: "/thumbnails/openai-chatapplication-udem.png",
//     price: 3980,
//     author: {
//       id: 3,
//       name: "Author 3",
//       description: "Author 3 description",
//       profile_icon: "https://source.unsplash.com/random/4",
//     },
//     content: "Content 3",
//     created_at: new Date().toString(),
//     updated_at: new Date().toString(),
//   },
//   // 他の本のデータ...
// ];

export default async function Home() {

  const {contents} = await getAllBooks();
  // console.log(contents)

  const session = await getServerSession(nextAuthOptions)
  const user = session?.user as User;

  let purchaseBookIds: string[] = [];
  if(user){
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" }
    );
    const purchasesData = await response.json()

    console.log("購入履歴")
    console.log(purchasesData)

    purchaseBookIds = purchasesData.map((purchaseBook: Purchase) => purchaseBook.bookId)
    // console.log(purchaseBookIds)

  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-20 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
          {contents.map((book: BookType) => (
            <Book
              key={book.id}
              book={book}
              isPurchased={purchaseBookIds.includes(book.id)}
            />
          ))}
      </main>
    </>
  );
}
