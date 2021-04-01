// API Url
const url = 'http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080';
const idTeam = 'spiders';

//Product Constructor
class Product {
    constructor(name, price, year, id=Math.random()) {
        this.name = name;
        this.price = price;
        this.year = year;
        this.id = id
    }
}

//UI Constructor
class UI {
    //Product template
    static addProduct(product) {
        const productList = document.getElementById("product-list");
        const element = document.createElement("div");
        element.innerHTML = `
        <div class="card text-center mb-4">
        <div class="card-body">
        <h5><strong>${product.name}</strong></h5>
        <strong>Price</strong>: ${product.price}€
        <strong>Year</strong>: ${product.year}
        <a href="#" id="${product.id}" onclick="UI.deleteProduct(event)" class="dlt btn btn-danger ml-5" name="delete">Delete</a>
        </div>
        </div>
        `;
        productList.appendChild(element);
    }
    
    static resetForm() {
        document.getElementById("product-form").reset();
    }
    
    static deleteProduct(event) {
        console.log("event", event.target.id)
        event.target.closest("div.card.text-center.mb-4").remove();
        UI.showMessage("Product removed successfully", "danger");

        deleteProductFromDatabase(event.target.id);
    }
    
    static showMessage(message, cssClass) {
        const msg = document.createElement("div");
        msg.className = `alert alert-${cssClass} mt-2 text-center`;
        msg.appendChild(document.createTextNode(message));
        
        //Show in the DOM
        const container = document.querySelector(".container");
        const app = document.querySelector("#app");
        
        //Insert message in the UI
        container.insertBefore(msg, app);
        
        //Remove after 2 seconds
        setTimeout(function () {
            document.querySelector(".alert").remove();
        }, 2000);
    }
}

//DOM Events
document.getElementById("product-form").addEventListener("submit", e => {
    const name = document.getElementById("product-name").value
    price = document.getElementById("product-price").value
    year = document.getElementById("product-year").value
    
    
    //Create a new Object Product
    const product = new Product(name, price, year);
    
    
    //Save product
    UI.addProduct(product);
    UI.resetForm();
    UI.showMessage("Product added successfully", "success");
    
    e.preventDefault();

    uploadProductToDatabase(product);
});


// GET

fetch(`${url}/list-products/${idTeam}`, {
    method: 'GET', // So, we can specify HTTP Methods here. Uh, interesting.
    headers: { 'Content-Type': 'application/json' }, // Type of data to retrieve. 
    mode: 'cors', // What is CORS?? https://developer.mozilla.org/es/docs/Web/HTTP/CORS 
})
.then(response => response.json())
.then(info => {
    const products = info;
    console.log(products);
    products.forEach(element => {
        const productN = new Product(element.title, element.price, element.year, element.id);
        if (productN.year <= new Date().getFullYear()) {
            UI.addProduct(productN);
        }
    })
});


// POST

function uploadProductToDatabase(product) {
    fetch(`${url}/add-product/${idTeam}`, {
    method: "POST",
    body: JSON.stringify({
        title: product.name,
        price: product.price,
        year: product.year
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })
    .then(response => response.json())
    .then(infoJson => {
        product.id = infoJson.id;
        console.log(product)
    });

    console.log("post-test");
}


// DELETE

function deleteProductFromDatabase(idProduct) {
    fetch(`${url}/add-product/${idTeam}/${idProduct}`, {
    method: "DELETE",
    })
    .then(response => response.json())
    .then(infoJson => {
        console.log(infoJson)
    });

    console.log("delete-test");
}
