(function () {
  "use strict";

  var HERO_TEXT = {
    repositories: {
      title: "Trending",
      subtitle: function (rangeLabel) { return "See what the GitHub community is most excited about " + rangeLabel + "."; }
    },
    developers: {
      title: "Trending",
      subtitle: function (rangeLabel) { return "These are the developers building the hot tools " + rangeLabel + "."; }
    }
  };

  var LISTS = [
    { id: "favorites", name: "Favorites" },
    { id: "read-later", name: "Read later" },
    { id: "cool-projects", name: "Cool projects" },
    { id: "inspiration", name: "Inspiration" },
    { id: "work", name: "Work" }
  ];

  var DATE_RANGE_MULTIPLIER = { daily: 1, weekly: 7, monthly: 30 };
  var DATE_RANGE_LABEL = { daily: "today", weekly: "this week", monthly: "this month" };

  var state = {
    view: "repositories",
    filters: { language: null, spoken_language: null, date_range: "daily" },
    data: { languages: [], spoken_languages: [], date_range: [], developers: [], repositories: [] },
    starred: {},
    followed: {},
    listMembership: {}
  };

  function fetchJson(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.json();
    });
  }

  function loadData() {
    return Promise.all([
      fetchJson("data/languages.json"),
      fetchJson("data/spoken_languages.json"),
      fetchJson("data/date_range.json"),
      fetchJson("data/developers.json"),
      fetchJson("data/repositories.json")
    ]).then(function (results) {
      state.data.languages = results[0];
      state.data.spoken_languages = results[1];
      state.data.date_range = results[2];
      state.data.developers = results[3];
      state.data.repositories = results[4];
    });
  }

  function languageColor(id) {
    var hash = 0;
    for (var i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    var hue = hash % 360;
    return "hsl(" + hue + ", 55%, 50%)";
  }

  function languageName(id) {
    var lang = state.data.languages.find(function (l) { return l.id === id; });
    return lang ? lang.name : id;
  }

  function developerById(id) {
    return state.data.developers.find(function (d) { return d.id === id; });
  }

  function repositoryById(id) {
    return state.data.repositories.find(function (r) { return r.id === id; });
  }

  function formatNumber(n) {
    return n.toLocaleString("en-US");
  }

  function svgStar() {
    return '<svg height="14" width="14" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path></svg>';
  }
  function svgHeart() {
    return '<svg height="14" width="14" viewBox="0 0 16 16"><path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path></svg>';
  }
  function svgFork() {
    return '<svg height="14" width="14" viewBox="0 0 16 16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>';
  }
  function svgCaretDown() {
    return '<svg height="14" width="14" viewBox="0 0 16 16"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path></svg>';
  }
  function svgStarFill() {
    return '<svg height="14" width="14" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>';
  }
  function svgRepo() {
    return '<svg height="14" width="14" viewBox="0 0 16 16" class="icon-repo"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>';
  }

  function renderRepoActions(repo) {
    var isStarred = !!state.starred[repo.id];
    var sponsorBtn = repo.sponsor
      ? '<a href="' + repo.link + '" class="btn-sponsor" aria-label="Sponsor ' + repo.name + '">' +
          svgHeart() + '<span class="d-md-inline">Sponsor</span>' +
        '</a>'
      : "";
    return (
      '<div class="repo-actions">' +
        sponsorBtn +
        '<div class="BtnGroup js-toggler-container js-social-container starring-container starring-container--with-list-menu d-flex' + (isStarred ? " on" : "") + '">' +
          '<button type="button" class="rounded-left-2 btn-sm btn BtnGroup-item' + (isStarred ? ' is-starred' : '') + '" data-action="toggle-star" data-repo-id="' + repo.id + '">' +
            (isStarred ? svgStarFill() : svgStar()) + '<span class="star-label">' + (isStarred ? "Starred" : "Star") + '</span>' +
          '</button>' +
          '<button type="button" class="Button Button--iconOnly Button--secondary Button--small rounded-right-2 rounded-left-0 px-3 tmp-px-3" data-action="open-lists" data-repo-id="' + repo.id + '" aria-label="Add ' + repo.name + ' to a list">' +
            svgCaretDown() +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderHero() {
    var text = HERO_TEXT[state.view];
    var rangeLabel = DATE_RANGE_LABEL[state.filters.date_range] || "today";
    var el = document.getElementById("footer-content");
    el.innerHTML = "<h1>" + text.title + "</h1><p>" + text.subtitle(rangeLabel) + "</p>";
  }

  function renderRepositories() {
    var container = document.getElementById("list-repositories");
    var multiplier = DATE_RANGE_MULTIPLIER[state.filters.date_range] || 1;
    var rangeLabel = DATE_RANGE_LABEL[state.filters.date_range] || "today";

    var repos = state.data.repositories
      .filter(function (r) {
        return !state.filters.language || r.language === state.filters.language;
      })
      .filter(function (r) {
        return !state.filters.spoken_language || r.spoken_language === state.filters.spoken_language;
      })
      .map(function (r) {
        return Object.assign({}, r, { period_stars: r.today_stars * multiplier });
      })
      .sort(function (a, b) { return b.period_stars - a.period_stars; });

    if (!repos.length) {
      container.innerHTML = '<div class="empty-state">No repositories match the selected filters.</div>';
      return;
    }

    container.innerHTML = repos.map(function (repo) {
      var contributors = repo.developers.map(developerById).filter(Boolean).slice(0, 6);
      var avatars = contributors.map(function (d) {
        return '<img src="' + d.icon + '" alt="' + d.name + '" title="' + d.name + '">';
      }).join("");

      var parts = repo.name.split("/");
      var owner = parts[0], name = parts[1];

      return (
        '<div class="trend-item">' +
          '<div class="repo-main">' +
            '<div class="repo-title-row">' +
              '<div class="repo-title">' +
                svgRepo() +
                '<a href="' + repo.link + '"><span class="owner">' + owner + ' / </span>' + name + '</a>' +
              '</div>' +
              renderRepoActions(repo) +
            '</div>' +
            '<p class="repo-desc">' + repo.description + '</p>' +
            '<div class="repo-meta">' +
              '<span class="meta-item"><span class="lang-dot" style="background:' + languageColor(repo.language) + '"></span>' + languageName(repo.language) + '</span>' +
              '<span class="meta-item">' + svgStar() + formatNumber(repo.number_of_stargazers) + '</span>' +
              '<span class="meta-item">' + svgFork() + formatNumber(repo.number_of_forks) + '</span>' +
              (avatars ? '<span class="contributors"><span class="contributors-label">Built by</span>' + avatars + '</span>' : '') +
              '<span class="today-stars">' + svgStar() + '<span>' + formatNumber(repo.period_stars) + ' stars ' + rangeLabel + '</span></span>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  function renderDevelopers() {
    var container = document.getElementById("list-developers");
    var devs = state.data.developers.filter(function (dev) {
      var repo = repositoryById(dev.repositories[0]);
      if (!repo) return false;
      if (state.filters.language && repo.language !== state.filters.language) return false;
      if (state.filters.spoken_language && repo.spoken_language !== state.filters.spoken_language) return false;
      return true;
    });

    if (!devs.length) {
      container.innerHTML = '<div class="empty-state">No developers match the selected filters.</div>';
      return;
    }

    container.innerHTML = devs.map(function (dev, index) {
      var repoId = dev.repositories[0];
      var repo = repositoryById(repoId);
      var repoBlock = repo
        ? (
            '<div class="dev-repo">' +
              '<div class="dev-repo-label">' + svgRepo() + 'Popular repo</div>' +
              '<div class="dev-repo-name"><a href="' + repo.link + '">' + repo.name + '</a></div>' +
              '<div class="dev-repo-desc">' + repo.description + '</div>' +
            '</div>'
          )
        : "";

      var isFollowing = !!state.followed[dev.id];

      return (
        '<div class="trend-item">' +
          '<div class="dev-rank">' + (index + 1) + '</div>' +
          '<div class="dev-avatar"><img src="' + dev.icon + '" alt="' + dev.name + '"></div>' +
          '<div class="dev-main">' +
            '<div class="dev-name"><a href="' + dev.link + '">' + dev.name + '</a></div>' +
            '<div class="dev-nickname">' + dev.nickname + '</div>' +
          '</div>' +
          repoBlock +
          '<div class="dev-follow">' +
            '<button type="button" class="btn btn-sm follow-btn' + (isFollowing ? ' is-following' : '') + '" data-action="toggle-follow" data-dev-id="' + dev.id + '">' +
              (isFollowing ? "Unfollow" : "Follow") +
            '</button>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  function renderFilterMenus() {
    var langList = document.querySelector('[data-list-for="language"]');
    langList.innerHTML =
      '<a href="#" data-filter-value="">Any</a>' +
      state.data.languages.map(function (l) {
        return '<a href="#" data-filter-value="' + l.id + '">' + l.name + '</a>';
      }).join("");

    var spokenList = document.querySelector('[data-list-for="spoken_language"]');
    spokenList.innerHTML =
      '<a href="#" data-filter-value="">Any</a>' +
      state.data.spoken_languages.map(function (l) {
        return '<a href="#" data-filter-value="' + l.id + '">' + l.name + '</a>';
      }).join("");

    var dateList = document.querySelector('[data-list-for="date_range"]');
    dateList.innerHTML = state.data.date_range.map(function (d) {
      return '<a href="#" data-filter-value="' + d.id + '">' + d.name + '</a>';
    }).join("");
  }

  function setupFilterSearch() {
    document.querySelectorAll(".filter-input").forEach(function (input) {
      input.addEventListener("input", function () {
        var target = input.getAttribute("data-filter-for");
        var query = input.value.toLowerCase();
        var list = document.querySelector('[data-list-for="' + target + '"]');
        list.querySelectorAll("a").forEach(function (a) {
          var match = a.textContent.toLowerCase().indexOf(query) !== -1;
          a.style.display = match ? "" : "none";
        });
      });
    });
  }

  function setupFilterSelection() {
    document.querySelectorAll(".select-menu-list").forEach(function (list) {
      list.addEventListener("click", function (e) {
        var link = e.target.closest("a[data-filter-value]");
        if (!link) return;
        e.preventDefault();
        var key = list.getAttribute("data-list-for");
        var value = link.getAttribute("data-filter-value");
        state.filters[key] = value || null;

        var valueLabel = document.querySelector('[data-value-for="' + key + '"]');
        valueLabel.textContent = value ? link.textContent.trim() : (key === "date_range" ? "Today" : "Any");

        list.closest("details").removeAttribute("open");
        render();
      });
    });
  }

  function setupDropdownBehavior() {
    var menus = Array.prototype.slice.call(document.querySelectorAll(".select-menu"));

    menus.forEach(function (menu) {
      menu.addEventListener("toggle", function () {
        if (!menu.open) return;
        menus.forEach(function (other) {
          if (other !== menu) other.removeAttribute("open");
        });
      });
    });

    document.addEventListener("click", function (e) {
      menus.forEach(function (menu) {
        if (menu.open && !menu.contains(e.target)) menu.removeAttribute("open");
      });
    });
  }

  function setupRepoActions() {
    document.querySelector("main").addEventListener("click", function (e) {
      var starBtn = e.target.closest('[data-action="toggle-star"]');
      if (starBtn) {
        var repoId = Number(starBtn.getAttribute("data-repo-id"));
        var isStarred = !state.starred[repoId];
        state.starred[repoId] = isStarred;
        starBtn.classList.toggle("is-starred", isStarred);
        starBtn.querySelector("svg").outerHTML = isStarred ? svgStarFill() : svgStar();
        starBtn.querySelector(".star-label").textContent = isStarred ? "Starred" : "Star";
        return;
      }

      var listsBtn = e.target.closest('[data-action="open-lists"]');
      if (listsBtn) {
        openListsDialog(Number(listsBtn.getAttribute("data-repo-id")), listsBtn);
        return;
      }

      var followBtn = e.target.closest('[data-action="toggle-follow"]');
      if (followBtn) {
        var devId = Number(followBtn.getAttribute("data-dev-id"));
        var isFollowing = !state.followed[devId];
        state.followed[devId] = isFollowing;
        followBtn.classList.toggle("is-following", isFollowing);
        followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
      }
    });
  }

  function positionOverlay(anchorEl) {
    var overlay = document.getElementById("lists-overlay");
    var rect = anchorEl.getBoundingClientRect();
    var gap = 6;

    var left = rect.right - overlay.offsetWidth;
    left = Math.max(8, Math.min(left, window.innerWidth - overlay.offsetWidth - 8));

    var top = rect.bottom + gap;
    if (top + overlay.offsetHeight > window.innerHeight - 8) {
      top = rect.top - overlay.offsetHeight - gap;
    }

    overlay.style.left = left + "px";
    overlay.style.top = top + "px";
  }

  function openListsDialog(repoId, anchorEl) {
    var membership = state.listMembership[repoId] || {};
    var body = document.getElementById("lists-body");
    body.innerHTML = LISTS.map(function (list) {
      var checked = membership[list.id] ? "checked" : "";
      return (
        '<label class="list-option">' +
          '<input type="checkbox" data-list-id="' + list.id + '" ' + checked + '>' +
          list.name +
        '</label>'
      );
    }).join("");

    body.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        var listId = checkbox.getAttribute("data-list-id");
        if (!state.listMembership[repoId]) state.listMembership[repoId] = {};
        state.listMembership[repoId][listId] = checkbox.checked;
      });
    });

    document.getElementById("lists-backdrop").hidden = false;
    positionOverlay(anchorEl);
  }

  function closeListsDialog() {
    document.getElementById("lists-backdrop").hidden = true;
  }

  function setupListsDialog() {
    document.getElementById("lists-close").addEventListener("click", closeListsDialog);
    document.getElementById("lists-create").addEventListener("click", function () {
      // Stub: creating lists isn't implemented, this button is a mocked placeholder.
    });
    document.getElementById("lists-backdrop").addEventListener("click", function (e) {
      if (e.target === document.getElementById("lists-backdrop")) closeListsDialog();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeListsDialog();
    });
  }

  function setView(view) {
    state.view = view;
    document.querySelectorAll("#view-tabs .subnav-item").forEach(function (t) {
      t.classList.toggle("is-selected", t.getAttribute("data-view") === view);
    });
    render();
  }

  function setupTabs() {
    document.querySelectorAll("#view-tabs .subnav-item").forEach(function (tab) {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        var view = tab.getAttribute("data-view");
        location.hash = "#/" + view;
        setView(view);
      });
    });

    window.addEventListener("hashchange", function () {
      var view = location.hash.replace("#/", "") || "repositories";
      if (view !== "repositories" && view !== "developers") view = "repositories";
      setView(view);
    });
  }

  function render() {
    var showRepos = state.view === "repositories";
    document.getElementById("list-repositories").hidden = !showRepos;
    document.getElementById("list-developers").hidden = showRepos;

    if (showRepos) {
      renderRepositories();
    } else {
      renderDevelopers();
    }
    renderHero();
  }

  loadData()
    .then(function () {
      renderFilterMenus();
      setupFilterSearch();
      setupFilterSelection();
      setupDropdownBehavior();
      setupTabs();
      setupRepoActions();
      setupListsDialog();
      var initialView = location.hash.replace("#/", "") || "repositories";
      if (initialView !== "repositories" && initialView !== "developers") initialView = "repositories";
      setView(initialView);
    })
    .catch(function (err) {
      document.getElementById("list-repositories").innerHTML =
        '<div class="empty-state">Could not load data: ' + err.message + '</div>';
      console.error(err);
    });
})();
