var Api = "http://localhost:3000";
var sec = [];
var user;
function Admin(event) {
  let searchname = document.getElementById("search").value;
  let errs;

  console.log(user);
  console.log("object");
  console.log(searchname);
  fetch(`${Api}/login`, {
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
document.addEventListener("DOMContentLoaded", function (params) {
  const head = `
       <nav class="navbar navbar-expand-lg bg-body-tertiary">
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
          aria-current="sec"
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
     <button type="button" onclick="opendialog(event)" class="btn btn-warning">Ekle</button>
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
  </div>
  </nav>   
    `;
  user = JSON.parse(localStorage.getItem("user")) || [];

  document.getElementById("bloghead").innerHTML += head;
  const update = `
  <div class="col-md-6">
                  <label for="inputİmg" class="form-label">İmg</label>
                  <input type="text" class="form-control" id="inputİmg" placeholder="Örn:Börek.png">
                </div>
                <div class="col-md-3">
                  <label for="inputproduct" class="form-label">Ürün</label>
                  <input type="text" class="form-control" id="inputproduct">
                </div>
                <div class="col-4">
                  <label for="inputMaterial" class="form-label">Materyal</label>
                  <input type="text" class="form-control" id="inputMaterial" >
                </div>
                <div class="col-md-12">
                  <label for="inputDetails" class="form-label">Detay</label>
                  <textarea name="" class="form-control" id="inputDetails"></textarea>
                </div>
               
                <div class="col-12">
                  <button type="button" id="sendsect" class="btn btn-primary" onclick="AddRec(event)">Kaydet</button>
                </div>`;
  document.getElementById("updatesec").insertAdjacentHTML("beforeend", update);
  console.log(sec);
  fetch(`${Api}/getrec`, {
    method: "Get",
    "content-type": "Application/json",
    Accept: "Application/json",
  })
    .then((res) => {
      if (!res.ok) {
        console.log(`Network is not Found: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.message);
      console.log(data.recipe);
      if (data.message) {
        console.log("Data:", data);
        sec = data.recipe;
        console.log(sec);
        console.log("okl");
        UpdateSection(sec);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  function UpdateSection(items) {
    // const list = document.getElementById("List");
    // for (let i = 1; i <= 10; i++) {
    //   list.innerHTML += `<li>List Item ${i}</li>`;
    // }
    let users = JSON.parse(localStorage.getItem("user"));
    user = JSON.stringify(users);
    if (user == null) {
      items.forEach((value) => {
        console.log(user);

        console.log(value.id);
        const section = `    <section  id="${value.matname}" class="row">
          
            <div class="col-md-4 justify-content-around">
              <img src="${value.img}" class="img-fluid" alt="..." >
              
            </div>
         
            <h2> ${value.matname} Yemeği için Gerekenler</h2>
         
            <h6>Malzemeler:</h3>
           <p><b>Hamur İçin:</b></p>
        <p><b>Hamuru Yapımı:</b>
      ${value.details}
         </p>
          <div class="col">
            <ul id="List">
            ${value.material}
            </ul> 
          </div>  
          
          </section>`;

        document
          .getElementById("section")
          .insertAdjacentHTML("beforeend", section);
      });
    } else {
      items.forEach((value) => {
        console.log(value.id);
        const section = ` <section  id="" class="row">
          
            <div class="col-md-4 justify-content-around">
              <img src="${value.img}" class="img-fluid" alt="..." >
              
            </div>
            <div class="col-md-6 float-end">
                <button type="button" class="float-end  btn btn-outline-danger"  onclick="DeleteSection(event,${value.id})">Sil</button>    
                <button type="button" class=" me-3 float-end  btn btn-outline-primary"  onclick="SectionEdit(event,${value.id})">Güncelle</button>    
            </div> 
            <h2> ${value.matname} Yemeği için Gerekenler</h2>
         
            <h6>Malzemeler:</h3>
           <p><b>Hamur İçin:</b></p>
        <p><b>Hamuru Yapımı:</b>${value.details}</p>
          <div class="col">
            <ul id="List">
            ${value.material}
            </ul> 
          </div>  
          
          </section>`;

        document
          .getElementById("section")
          .insertAdjacentHTML("beforeend", section);
      });
    }
  }
});

function Search(event) {
  console.log(sec);
  console.log(user);
  const searchname = document.getElementById("search").value;

  if (searchname == "Adminstratör2242") {
    document.getElementById("searchon").setAttribute("onclick", "Admin(event)");
    document.getElementById("mod").style.display = "Block";
  } else {
    sec = sec.forEach((sec) => {
      sec.foodname.includes(searchname);
    });
  }
  if (searchname == "Adminiexit") {
    alert("Admin is Log Out");
    localStorage.removeItem("user");
    document
      .getElementById("searchon")
      .setAttribute("onclick", "Search(event)");
    window.location.href = `/Frontend/View/blog.html`;
  }
  console.log(sec);
  // let card = `  <div class="col-md-12 mb-8 ms-md-2"   style="width:20rem; margin-top: 2rem;">
  //       <div class="row">
  //       <div  class="card"id="${}" >
  //       <img src="/Frontend/Img${sec.img}" class="card-img-top" id="img" alt="">
  //       <hr>
  //       <div class="card-body">
  //       <h5 class="card-title" id="0">
  //       ${sec.foodname}
  //       </h5>
  //       <p class="card-text">${sec.details}</p>
  //       <button type="button" class="btn btn-secondary" onclick="Detail(${sec.id})">Detay</button>
  //       </div>
  //       </div>`;
}
function opendialog(event) {
  const sectionupdate = document.getElementById("updatesec");
  if (sectionupdate.style.display === "none") {
    sectionupdate.style.display = "Block";
    console.log("Succsess");
  } else {
    sectionupdate.style.display = "none";
  }
}
function AddRec(event) {
  const newimg = document.getElementById("inputİmg").value;
  const newmatname = document.getElementById("inputproduct").value;
  const newmat = document.getElementById("inputMaterial").value;
  const newdetail = document.getElementById("inputDetails").value;
  fetch(`${Api}/recipe`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      Accept: "Application/json",
    },

    body: JSON.stringify({
      img: newimg,
      matname: newmatname,
      material: newmat,
      details: newdetail,
    }),
  })
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        console.error("POST Method not found", res.statusText);
      } else {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data.message);
      console.log(data);
      if (data.status == true) {
        sec.push(data);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
function DeleteSection(event, id) {
  console.log(id);
  fetch(`${Api}/delrec/${id}`, {
    method: "DELETE",
    "content-type": "Application/json",
    Accept: "Application/json",
  })
    .then((res) => {
      if (!res.ok) {
        console.log(`Network is not Found: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.message);
      console.log(data);
      if (data.status == 200) {
        event.target.closest("section").remove();
        sec = sec.filter((sec) => sec.id !== id);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
function SectionEdit(event, id) {
  let sect = sec.filter((sec) => sec.id == id);
  console.log();
  document.getElementById("inputİmg").value = sect[0].img;
  document.getElementById("inputproduct").value = sect[0].matname;
  document.getElementById("inputMaterial").value = sect[0].material;
  document.getElementById("inputDetails").value = sect[0].details;
  document.getElementById("sendsect").innerHTML = "Güncelle";
  document
    .getElementById("sendsect")
    .setAttribute("onclick", "javascript: Updatesection(event," + id + ")");
  document.getElementById("updatesec").style.display = "Block";
}
function Updatesection(event, id) {
  const newimg = document.getElementById("inputİmg").value;
  const newmat = document.getElementById("inputproduct").value;
  const material = document.getElementById("inputMaterial").value;
  const newdetail = document.getElementById("inputDetails").value;
  console.log(newimg);
  fetch(`${Api}/putrec/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      id: id,
      img: newimg,
      matname: newmat,
      material: material,
      details: newdetail,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        console.log(`Network is not Found: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.message);
      if (data.status == true) {
        alert("data güncellendi");
      }
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
  document.getElementById("updatesect").style.display = "block";
}
