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
    
      </div>
    </div>
    <div id="mod">
      
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
  document.getElementById("head").insertAdjacentHTML("beforeend", head);
});
