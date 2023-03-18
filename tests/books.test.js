process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app")
const db = require("../db");
const Book = require("../models/book")



describe("Testing book routes", function () {
    // setup
    beforeEach(async function () {
        await db.query("DELETE FROM books");
        const book = await Book.create({
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
          });
    });

    test("can get all books", async () => {
        
        let result = await request(app).get("/books");

        expect(result.body).toEqual({
            books: [{
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
              }]
        })
    })

    test("can get single book", async () => {

        let result = await request(app).get(`/books/0691161518`);
        expect(result.body).toEqual({
            book: {
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
              }
        });
    });
    
    test("returns 404 if isbn is invalid", async () => {
        let result = await request(app).get(`/books/1111111111`);
        expect(result.statusCode).toBe(404);
    });

    test("can add a book", async () => {
        // insert a book
        let result = await request(app)
        .post('/books')
        .send({
            isbn: "1234567891",
            amazon_url: "http://a.co/newInfo",
            author: "Bathilda Bagshot",
            language: "english",
            pages: 300,
            publisher: "Hogwarts Academy Press",
            title: "Hogwarts: A History",
            year: 1811
        });
        // expect output of {book: {}}
        expect(result.body).toEqual({
            book:{
                isbn: "1234567891",
                amazon_url: "http://a.co/newInfo",
                author: "Bathilda Bagshot",
                language: "english",
                pages: 300,
                publisher: "Hogwarts Academy Press",
                title: "Hogwarts: A History",
                year: 1811
            }
        });
        // check for all returned books array to be length of 2
        let newResult = await request(app).get("/books");
        expect(newResult.body.books.length).toEqual(2);
    });

    

    test("can update book", async () => {
        let result = await request(app)
            .put(`/books/0691161518`)
            .send({
                isbn: "0691161518",
                amazon_url: "http://a.co/newInfo",
                author: "Bathilda Bagshot",
                language: "english",
                pages: 300,
                publisher: "Hogwarts Academy Press",
                title: "Hogwarts: A History",
                year: 1811
              });
        expect(result.body).toEqual({
            book: {
                isbn: "0691161518",
                amazon_url: "http://a.co/newInfo",
                author: "Bathilda Bagshot",
                language: "english",
                pages: 300,
                publisher: "Hogwarts Academy Press",
                title: "Hogwarts: A History",
                year: 1811
            }
        });
        
    });

    test("returns 400 if isbn is invalid", async () => {
        let result = await request(app).put(`/books/1111111111`);
        expect(result.statusCode).toBe(400);
    });

    test("can delete book", async () => {
        let result = await request(app)
        .delete("/books/0691161518");
        expect(result.body).toEqual({ message: "Book deleted" });

        // check for all returned books array to be length of 0
        let newResult = await request(app).get("/books");
        expect(newResult.body.books.length).toEqual(0);
    });

});

afterAll(async () => {
    await db.end();
});