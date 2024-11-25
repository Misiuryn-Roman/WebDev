import React from "react";
import CatalogCards from "./CatalogCards/CatalogCards.js";
import DocumentTitle from "../../components/helmet/document_title.js";
import Header from "../Header/Header.js";

function Catalog() {
    DocumentTitle("Catalog");

    return (
        <div>
            <Header/>
            <CatalogCards/>
        </div>
    );
}

export default Catalog;