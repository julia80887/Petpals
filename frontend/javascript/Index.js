document.addEventListener("DOMContentLoaded", function () {
  const dogGrid = document.getElementById("dogGrid");
  const catGrid = document.getElementById("catGrid");
  const otherAnimalsGrid = document.getElementById("otherAnimalsGrid");
  const shelterGrid = document.getElementById("shelterGrid");

  const dogFilter = document.getElementById("dogFilter");
  const catFilter = document.getElementById("catFilter");
  const otherAnimalsFilter = document.getElementById("otherAnimalsFilter");
  const shelterFilter = document.getElementById("shelterFilter");

  const noResultFound = document.getElementById("noResultFound");

  AlphabeticalAnimalsGrid.style.display = "grid";
  AgeAnimalsGrid.style.display = "none";
  DistanceAnimalsGrid.style.display = "none";
  SizeAnimalsGrid.style.display = "none";

  dogGrid.style.display = "none";
  catGrid.style.display = "none";
  otherAnimalsGrid.style.display = "none";
  shelterGrid.style.display = "none";

  noResultFound.style.display = "none";

  dogFilter.style.borderBottom = "none";
  catFilter.style.borderBottom = "none";
  otherAnimalsFilter.style.borderBottom = "none";
  shelterFilter.style.borderBottom = "none";

  function resetFilters() {
    AlphabeticalAnimalsGrid.style.display = "grid";
    AgeAnimalsGrid.style.display = "none";
    DistanceAnimalsGrid.style.display = "none";
    SizeAnimalsGrid.style.display = "none";

    dogGrid.style.display = "none";
    catGrid.style.display = "none";
    otherAnimalsGrid.style.display = "none";
    shelterGrid.style.display = "none";

    noResultFound.style.display = "none";

    dogFilter.style.borderBottom = "none";
    catFilter.style.borderBottom = "none";
    otherAnimalsFilter.style.borderBottom = "none";
    shelterFilter.style.borderBottom = "none";
  }

  function toggleFilter(grid, filter) {
    if (grid.style.display === "none") {
      resetFilters();
      AlphabeticalAnimalsGrid.style.display = "none";
      AgeAnimalsGrid.style.display = "none";
      DistanceAnimalsGrid.style.display = "none";
      SizeAnimalsGrid.style.display = "none";
      noResultFound.style.display = "none";
      grid.style.display = "grid";
      filter.style.borderBottom = "3px solid #573F35";
    } else {
      resetFilters();
    }
  }

  dogFilter.addEventListener("click", function () {
    toggleFilter(dogGrid, dogFilter);
  });

  catFilter.addEventListener("click", function () {
    toggleFilter(catGrid, catFilter);
  });

  otherAnimalsFilter.addEventListener("click", function () {
    toggleFilter(otherAnimalsGrid, otherAnimalsFilter);
  });

  shelterFilter.addEventListener("click", function () {
    toggleFilter(shelterGrid, shelterFilter);
  });

  const puppy = document.getElementById("puppy");
  const young = document.getElementById("young");
  const adult = document.getElementById("adult");
  const senior = document.getElementById("senior");

  puppy.addEventListener("click", function () {
    puppy.classList.add("selectedTab");
    young.classList.remove("selectedTab");
    adult.classList.remove("selectedTab");
    senior.classList.remove("selectedTab");
  });

  young.addEventListener("click", function () {
    puppy.classList.remove("selectedTab");
    young.classList.add("selectedTab");
    adult.classList.remove("selectedTab");
    senior.classList.remove("selectedTab");
  });

  adult.addEventListener("click", function () {
    puppy.classList.remove("selectedTab");
    young.classList.remove("selectedTab");
    adult.classList.add("selectedTab");
    senior.classList.remove("selectedTab");
  });

  senior.addEventListener("click", function () {
    puppy.classList.remove("selectedTab");
    young.classList.remove("selectedTab");
    adult.classList.remove("selectedTab");
    senior.classList.add("selectedTab");
  });

  const small = document.getElementById("small");
  const medium = document.getElementById("medium");
  const large = document.getElementById("large");
  const xlarge = document.getElementById("xlarge");

  small.addEventListener("click", function () {
    if (small.classList.contains("selectedButton")) {
      small.classList.remove("selectedButton");
    } else {
      small.classList.add("selectedButton");
    }
  });

  medium.addEventListener("click", function () {
    if (medium.classList.contains("selectedButton")) {
      medium.classList.remove("selectedButton");
    } else {
      medium.classList.add("selectedButton");
    }
  });

  large.addEventListener("click", function () {
    if (large.classList.contains("selectedButton")) {
      large.classList.remove("selectedButton");
    } else {
      large.classList.add("selectedButton");
    }
  });

  xlarge.addEventListener("click", function () {
    if (xlarge.classList.contains("selectedButton")) {
      xlarge.classList.remove("selectedButton");
    } else {
      xlarge.classList.add("selectedButton");
    }
  });
});
