describe("home page", () => {
    it("successfully loads", () => {
        cy.visit("/");
    });

    it("successfully loads tailwind", () => {
        cy.get("h1").should("have.css", "font-weight", "700");
        cy.get("h1").should("have.css", "color", "rgb(17, 24, 39)");
    });
});
