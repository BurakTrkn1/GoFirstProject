var page = [];
var Api = "http://localhost:3000/";
var user;

document.addEventListener("DOMContentLoaded", (event) => {
  fetch(`${Api}foods`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Networ was is not ok", res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      page = data;
      UpdatePage(page);
      console.log(page);
    })
    .catch((err) => {
      console.log(err);
    });

  // File

  function UpdatePage(items) {
    const use = localStorage.getItem("user");
    user = JSON.parse(use);
    console.log(user);
    items.forEach((value) => {
      console.log(value.img);
      if (user) {
        let card = ` 

          <div class="col-md-12 mb-8 ms-md-2"   style="width:20rem; margin-top: 2rem;">
          <div class="row">
          <div  class="card" id="${value.id}" >
          <img src="/Frontend/Img/${value.img}" class="card-img-top" id="img" alt="">
          <hr>
          <div class="card-body">
          <h5 class="card-title" id="0">
          ${value.foodname}
          </h5>
          <p class="card-text">${value.details}</p>
          <button type="button" class="btn btn-secondary" onclick="Detail(${value.id})">Detay</button>
          <button type="button" class="btn btn-danger" onclick="DeleteProduct(event,${value.id})" style="position:relative; left:8rem;">Delete</button>
          <button type="button" class="btn btn-secondary" onclick="Productedit(${value.id})" style="position:relative; left:-1rem;">Edit</button>

          </div>
          </div>
          </div>

        
          
          `;
        document.getElementById("food").innerHTML += card;
      } else {
        let card = ` 
            
        <div class="col-md-12 mb-8 ms-md-2"   style="width:20rem; margin-top: 2rem;">
        <div class="row">
        <div  class="card"id="${value.id}" >
        <img src="/Frontend/Img/${value.img}" class="card-img-top" id="img" alt="">
        <hr>
        <div class="card-body">
        <h5 class="card-title" id="0">
        ${value.foodname}
        </h5>
        <p class="card-text">${value.details}</p>
        <button type="button" class="btn btn-secondary" onclick="Detail(${value.id})">Detay</button>
        </div>
        </div>
        
        `;
        document.getElementById("food").innerHTML += card;
      }
    });
  }
  let body = `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
  <button
    class="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarScroll"
    aria-controls="navbarScroll"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarScroll">
    <ul
      class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
      style="--bs-scroll-height: 100px"
    >
      <li class="nav-item">
        <a
          class="nav-link active"
          id="nav-link"
          aria-current="page"
          href="../View/index.html"
          >Home</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" id="nav-link" href="../View/blog.html"
          >Blog</a
        >
      </li>

      <li class="nav-item">
        <a class="nav-link" id="nav-link" href="../View/Foods.html"
          >Foods</a
        >
      </li>
    </ul>
      <div id="mod">
       <button
    type="button"
    class="btn btn-primary"
    id="addProductBtn"
    style="position:relative; left:-5rem;"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    AddProduct
  </button>

  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Modal title
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
           <input
          type="text"
          class="form-control"
          id="imgInp"
          placeholder="Örn:Börek.png"
         />


          </div>
          <div class="mb-3">
            <label for="foodname" class="form-label">Yemek Adı</label>
            <input
              type="text"
              class="form-control"
              id="foodname"
              name="foodname"
            />
          </div>
          <div class="mb-3">
            <label for="detail" class="form-label">Detaylar</label>
            <textarea
              class="form-control"
              id="detail"
              name="detail"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            id="change"
            onclick="AddProduct(event)"
          >
            Kaydet
          </button>
          <button
            style="float: right"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    </div>
      </div>
    </div>
  
    <form class="d-flex" role="search">
      <input
        class="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        id="search"
      />
      <button
        class="btn btn-outline-success"
        type="button"
        id="searchon"
        onclick="
       Search(event)"
      >
        Search
      </button>
    </form>
  </nav>`;
  document.getElementById("foodhead").innerHTML += body;
  var la = document.getElementsByClassName("head").value;
  console.log(la);
});
function Admin(event) {
  let searchname = document.getElementById("search").value;
  let errs;

  console.log(user);
  console.log("object");
  console.log(searchname);
  fetch(`${Api}login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "Admin",
      password: "21331025",
      role_name: "Admin",
    }),
  })
    .then((res) => {
      console.log(res);
      if (res.status == 401) {
        let cr = `
              
                <div class="alert alert-danger" style="width: 20em; float:right;"  role="alert">
                     Kullanıcı bulunumadı
                    </div>`;
        document.getElementById("alert").innerHTML += cr;
      }
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Data:", data);
      if (data.status === 200) {
        user = JSON.parse(localStorage.getItem("user")) || [];
        user.push(data.user);

        document.getElementById("addProductBtn").style.display = "Block";
        localStorage.setItem("user", JSON.stringify(user));
        console.log(user);
        alert("Login Sucsessfuly");
      }

      if (data.message) {
        console.log("Message:", data.message);
      } else {
        console.log("Received data:", data);
      }
    })
    .catch((err) => {
      console.error("Error occurred:", err.message);
      errs = err;
      console.log(errs);
    });
  console.log(user);
  if (searchname == "Adminiexit") {
    console.log("Adminin uykusu geldi");
    document
      .getElementById("searchon")
      .setAttribute("onclick", "Search(event)");
  }
  // const urlParams = new URLSearchParams(window.location.search);
  // const isAdmin = urlParams.get("isAdmin");
  // console.log(urlParams);
  // console.log(isAdmin);
  // if (isAdmin === "true") {
  //   document.getElementById("addProductBtn").style.display = "block";
  // } else {
  //   document.getElementById("addProductBtn").style.display = "none";
  // }
}
function Detail(id) {
  console.log(id);
  let href = "";
  page.forEach((event) => {
    if (event.id == id) {
      href = event.foodname;
      console.log(href);
      window.location.href = `blog.html#${href}`;
    } else {
      console.log("dont is match");
    }
  });
}
function highlightSelectedFood() {
  const hash = window.location.hash.substring(1); // Hash'den # karakterini kaldır
  if (hash) {
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("highlight");
    }
  }
}

// const fileIn = document.getElementById("imgInp");
// const readUrl = (event) => {
//   const fileOut = document.getElementById("imgOut");
//   if (event.files && event.files[0]) {
//     let reader = new FileReader();
//     reader.onload = (event) => (fileOut.src = event.target.result);
//     reader.readAsDataURL(event.files[0]);
//   }
//   fileIn.onchange = function () {
//     readUrl(this);
//   };
// };

function AddProduct(event) {
  const fileInput = document.getElementById("imgInp").value;
  const food = document.getElementById("foodname").value;
  const detail = document.getElementById("detail").value;

  fetch(`${Api}food`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      img: fileInput, // Base64 stringini backend'e gönderiyoruz
      foodname: food,
      details: detail,
    }),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log("Data received:", data);
      if (data.status == 201) {
        document.getElementById("imgInp").innerHTML = "";
        document.getElementById("foodname").innerHTML = "";
        document.getElementById("detail").innerHTML = "";
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });
}

function DeleteProduct(event, id) {
  console.log(id);
  fetch(`${Api}foods/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "Application/json",
      Accept: "Application/json",
    },
  })
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        console.error("Not Delete Method", res.statusText);
      }
      if (res.status == 200) {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
      if (data.message) {
        window.location.href = `Foods.html?${data.message}`;
        alert(data.message);
        console.log("Data", data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  event.target.closest(".card").remove();
  page = page.filter((item) => item.id != id);
}
let procedure;
function Productedit(id) {
  console.log(id);
  console.log("ok");
  console.log(page);
  let pros = page.filter((prod) => prod.id == id);
  console.log(pros[0].foodname);
  document.getElementById("imgInp").value = pros[0].img;
  document.getElementById("foodname").value = pros[0].foodname;
  document.getElementById("detail").value = pros[0].details;
  document.getElementById("change").innerHTML = "Edit";
  document
    .getElementById("change")
    .setAttribute("onclick", "javascript: UpdateProduct(event," + id + ")");
  const mymodal = new bootstrap.Modal("#exampleModal", {
    keyboard: false,
  });
  mymodal.show();
  procedure = pros;
}
function UpdateProduct(event, id) {
  const newımg = document.getElementById("imgInp").value;
  const newfood = document.getElementById("foodname").value;
  const newdetail = document.getElementById("detail").value;

  console.log(newımg);
  console.log(id);
  console.log(procedure);
  fetch(`${Api}getfood/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "Application/json",
      Accept: "Application/json",
    },
    body: JSON.stringify({
      img: newımg,
      foodname: newfood,
      details: newdetail,
    }),
  })
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        console.error("PUT Method not found", res.statusText);
      } else {
        window.location.href = `/Frontend/View/Foods.html?id=${id}`;
        return res.json();
      }
    })
    .then((data) => {
      console.log("Data :", data);
      if (data.message) {
        return data.message;
      }
    });
}
function Search(event) {
  console.log(page);
  console.log(user);
  const searchname = document.getElementById("search").value;

  if (searchname == "Adminstratör2242") {
    document.getElementById("searchon").setAttribute("onclick", "Admin(event)");
  } else {
    page = page.forEach((page) => {
      page.foodname.includes(searchname);
    });
  }
  if (searchname == "Adminiexit") {
    alert("Admin is Log Out");
    localStorage.removeItem("user");
    document
      .getElementById("searchon")
      .setAttribute("onclick", "Search(event)");
    window.location.href = `/Frontend/View/Foods.html`;
  }
  console.log(page);
  // let card = `  <div class="col-md-12 mb-8 ms-md-2"   style="width:20rem; margin-top: 2rem;">
  //       <div class="row">
  //       <div  class="card"id="${}" >
  //       <img src="/Frontend/Img${page.img}" class="card-img-top" id="img" alt="">
  //       <hr>
  //       <div class="card-body">
  //       <h5 class="card-title" id="0">
  //       ${page.foodname}
  //       </h5>
  //       <p class="card-text">${page.details}</p>
  //       <button type="button" class="btn btn-secondary" onclick="Detail(${page.id})">Detay</button>
  //       </div>
  //       </div>`;
}
