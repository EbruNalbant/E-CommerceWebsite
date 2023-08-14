//!HTML'den gelenler
const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");

//!API İşlemleri
//HTML'nin yüklenme anı
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

const baseUrl = "https://fakestoreapi.com";

//kategori bilgilerini alma
function fetchCategories() {
  fetch(`${baseUrl}/products`)
    //cevap olumlu gelirse çalışır
    .then((res) => res.json())
    //veri json formatına dönünce çalışır
    .then((data) => renderCategories(data.slice(12, 16)))
    //cevapta hata varsa çalışır
    .catch((err) => console.log(err));
}

//kategori dizisindeki her bir obje için ekrana kart basma
function renderCategories(categories) {
  categories.forEach((cat) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category-card");
    categoryDiv.innerHTML = `<img src= ${cat.image}>
             <p>${cat.category} </p>
       `;
    categoryList.appendChild(categoryDiv);
  });
}

//ürün bilgilerini alma
async function fetchProducts() {
  try {
    //isteği atar
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    //hata olursa yakalar
    console.log(err);
  }
}

//ürünleri ekrana basma
function renderProducts(products) {
  const productsHTML = products
    .map(
      (product) => `
        <div class="card">
            <img src=${product.image} >
            <h4>${product.title} </h4>
            <h4>${product.category} </h4>
            <div class="action">
                 <span>$ ${product.price} </span>
                 <button onclick ="addToBasket(
                    {id:${product.id}, title: '${product.title}', price: ${product.price}, img: '${product.image}', amount: 1})
                    ">Add to Basket</button>
            </div>
        </div>
`
    ) //dizi şeklindeki veriyi stringe dönüştürme
    .join("");
  //ürünler HTML'ini listeye gönderme
  productsArea.innerHTML += productsHTML;
}
//Sepet değişkenleri
let basket = [];
let total = 0;

//!Modal işlemleri
basketBtn.addEventListener("click", () => {
  //sepeti açma
  modal.classList.add("active");
  //sepete ürünleri listeleme
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  //sepeti kapatma
  modal.classList.remove("active");
});

//!Sepet İşlemleri

//sepete ekleme işlemi
function addToBasket(product) {
  //ürün sepete daha önce eklendi mi kontrolü
  const found = basket.find((i) => i.id === product.id);

  if (found) {
    //eleman sepette var ise miktarı arttırma
    found.amount++;
  } else {
    //eleman sepette yok ise sepete ekleme
    basket.push(product);
  }
}

//sepete elemanları listeleme
function renderBasket() {
  //kartları oluşturma
  const cardsHTML = basket
    .map(
      (product) => `
    <div class="item">
         <img src= ${product.img} >
        <h4 class="title">${product.title}</h4>
        <h3 class="price">${product.price}$</h3>
        <p>Amount :${product.amount}</p>
        <img onclick = "deleteItem(${product.id})" id="delete" src="images/e-trash.png" />
  </div>
    `
    )
    .join("");
  //hazırlanılan kartları HTML'e gönderme
  basketList.innerHTML = cardsHTML;
  //toplam değeri hesaplama
  calculateTotal();
}

//sepette toplam bölümünü ayarlama
function calculateTotal() {
  //toplam fiyatı hesaplama
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  //ürün miktarını hesaplama
  const amount = basket.reduce((sum, i) => sum + i.amount, 0);
  //miktarını HTML'e gönderme
  totalCount.innerText = amount;

  //toplam değeri HTML'e gönderme
  totalSpan.innerText = sum;
}

//sepetten ürünü silme fonksiyonu
function deleteItem(deleteid) {
  //kaldırılıcak ürün dışındaki bütün ürünleri alma
  basket = basket.filter((i) => i.id !== deleteid);
  //listeyi güncelleme
  renderBasket();
  //toplamı güncelleme
  calculateTotal();
}
