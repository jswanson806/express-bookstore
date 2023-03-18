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

    test("returns 400 if isbn is missing", async () => {
        let result = await request(app)
            .post(`/books`)
            .send({
                amazon_url: "http://a.co/newInfo",
                author: "Bathilda Bagshot",
                language: "english",
                pages: 300,
                publisher: "Hogwarts Academy Press",
                title: "Hogwarts: A History",
                year: 1811
              });
        expect(result.statusCode).toBe(400);
    });

    test("returns 400 if amazon_url is missing", async () => {
        let result = await request(app)
            .post(`/books`)
            .send({
                isbn: "0691161518",
                author: "Bathilda Bagshot",
                language: "english",
                pages: 300,
                publisher: "Hogwarts Academy Press",
                title: "Hogwarts: A History",
                year: 1811
              });
        expect(result.statusCode).toBe(400);
    });

    test("returns 400 if author is not a string", async () => {
        let result = await request(app)
            .post(`/books`)
            .send({
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: 123456,
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
              });
        expect(result.statusCode).toBe(400);
    });

    test("returns 400 if pages is not a number", async () => {
        let result = await request(app)
            .post(`/books`)
            .send({
                isbn: "0691161518",
                amazon_url: "http://a.co/newInfo",
                author: "Bathilda Bagshot",
                language: "english",
                pages: "300",
                publisher: "Hogwarts Academy Press",
                title: "Hogwarts: A History",
                year: 1811
              });
        expect(result.statusCode).toBe(400);
    });


    test("returns 400 if year is not a number", async () => {
        let result = await request(app)
            .post(`/books`)
            .send({
                isbn: "0691161518",
                amazon_url: "http://a.co/newInfo",
                author: "Bathilda Bagshot",
                language: "english",
                pages: 300,
                publisher: "Hogwarts Academy Press",
                title: "Hogwarts: A History",
                year: "1811"
              });
        expect(result.statusCode).toBe(400);
    });
});


afterAll(async () => {
    await db.end();
});