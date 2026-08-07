Context: Copy functional and ui part of https://github.com/trending page.
languages: [HTML, CSS, JavaScript]
Steps:
  1. Generate data for fill the pages:
    1.1 parse languages from filters on https://github.com/trending from selector '#select-menu-language > summary' and set object languages with children with fields id and name and create json file for it
    1.2 parse spoken languages from filters on https://github.com/trending from selector '#select-menu-spoken-language > summary' and set object spoken_languages with fields id and name and create json file for it
    1.3 parse date range from filters on https://github.com/trending from selector '#select-menu-date > summary' and set object date_range with fields id and name and create json file for it
    1.4 generate 20 objects(developers) with fields:
      - name(string)
      - nickname(string)
      - link(string should be mocked and redirect to current page)
      - icon (string image link)
      - repositories (Array of id from object repositories from object that will later create)
    1.5 write it on separate file type json with name developers
    1.6 generate 20-25 objects(repositories) with fields:
      - name of repository with name like github styles 'sirious/globals' (string)
      - description of repository (text)
      - language (id from object languages)
      - number_of_stargazers (random number with type integer)
      - number_of_forks (random number with type integer)
      - developers ( Array of developers form object developers)
      - link(string should be mocked and redirect to current page)
      - sponsor (type boolean random true or false)
      - today_stars (number random less than number of stargazers)
    1.7 write it on separate file type json with name repositories
    1.8 update file with developers to add repositories id( 1 or more )
    1.9 add fuction to split Trend/Free-3D-Memoji-Avatars-Pack.webp to separate avatars and with them to folder avatars with different name to this folder and set image link with name 'icon'
  2 parse pages https://github.com/trending and https://github.com/trending/developers to copy pages from element with class 'color-bg-subtle border-bottom' to footer
  3. When click on '<a class="js-selected-navigation-item subnav-item" data-selected-links="trending_repositories /trending" href="/trending">Repositories</a>' or '<a class="js-selected-navigation-item selected subnav-item" aria-current="page" data-selected-links="trending_developers /trending/developers" href="/trending/developers">Developers</a>' move to this page.
  4. when change value of filter 'spoken_languages' 'languages' 'date_range' change result in page, inside filter and typing in filter field input show only consistent filter records.
  5. when click on element with class 'rounded-left-2 btn-sm btn BtnGroup-item' change from Star to Starred and make icon color yellow
  6. when click on element with class 'Button Button--iconOnly Button--secondary Button--small rounded-right-2 rounded-left-0 px-3 tmp-px-3' should render list in dialog with class="Overlay Overlay-whenNarrow Overlay--size-small-portrait" with clickable checkbox and when submit render modal window with class 'Box Box--overlay d-flex flex-column anim-fade-in fast hx_rsm-dialog hx_rsm-modal
  '
