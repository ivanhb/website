
var sections = (function () {

  function footer() {
    $("#section_structure").after("<footer></footer>");
  }

  function head(section="home") {
    var active = "";
    if (section == "home") {
      active = "active";
      $("#section_structure").removeClass("hide-it");
    }else {
      $("#section_structure").addClass("hide-it");
    }
    var nav_html = '<a class="nav-item item '+active+'" href="'+layout_config.homepage+'">Home</a>';
    active = "";
    for (var a_section in layout_config.nav_menu) {
      var sec_obj = layout_config.nav_menu[a_section];
      if (section == a_section) {
        active = "active";
      }
      nav_html = '<a class="nav-item item '+active+'" href="'+layout_config.pages_dir+sec_obj.link+'">'+sec_obj.title+'</a>'+nav_html;
      active = "";
    }

    var homelogo = "";
    if ("homelogo" in layout_config) {
      if ("link" in layout_config["homelogo"]) {
        homelogo = "<a href='"+layout_config.homepage+"'><img src='"+layout_config["homelogo"]["link"]+"'></a>";
      }
    }

    $("#menu_logo").html(homelogo);
    $("#menu_nav").html(nav_html);

    $( "#menu_nav_logo" ).click(function() {
          $("#menu_nav_list").toggle();

          if ($("#menu_nav_list").html() == "") {
            $("#menu_nav_list").html($("#menu_nav").html());
          }else {
            $("#menu_nav_list").html("");
          }

    });
  }

  function homepage() {
    $.ajax({
           type: "GET",
           url: "https://ivanhb.github.io/doc/personal/bio.json",
           dataType: "json",
           error: function() {},
           success: function(data) {
             if ("items" in data) {
               var bio_obj = data["items"][0];
               var an_item_html = "<div class='bio_contacts'>"+normalize_contacts(bio_obj["contacts"])+"</div>";

               $(".contacts").html("<div>"+an_item_html+"</div>");
               //Build Dynamic Sections
               if ("dynamic_section" in my_config) {
                 build_dynamic_section(my_config["dynamic_section"]);
               }
             }
           }
    });
  }

  function shortbio() {
    $.ajax({
           type: "GET",
           url: "https://ivanhb.github.io/edu/index/bio.json",
           dataType: "json",
           error: function() {},
           success: function(data) {
             if ("items" in data) {
               var bio_obj = data["items"][0];
               var description = bio_obj["description"];
               var image = "<img class='prof-img ui circular image img-thumbnail bordered' src='"+bio_obj["image"]+"'>";
               $("#bio_description").html(description);
               $("#bio_img").html(image);
               $("#others_elems").html("<div class='bio_contacts'>"+normalize_contacts(bio_obj["contacts"])+"</div>");
             }
           }
    });
  }

  function projects(){
    $.ajax({
        type: "GET",
        url: get_sec_conf('projects')['source'],
        dataType: "json",
        error: function() {},
        success: function(data) {

          if ("items" in data) {
            for (var i = 0; i < data["items"].length; i++) {
              var an_item_obj = data["items"][i];

              var an_item_html = "<div class='title'>"+an_item_obj["name"]+"</div>";
              an_item_html += "<div class='date'>"+an_item_obj["start_date"]+" - "+an_item_obj["end_date"]+"</div>";
              an_item_html += "<div class='description'>"+an_item_obj["description"]+"</div>";
              an_item_html += "<div class='people'>"+normalize_people(an_item_obj["people"])+"</div>";
              an_item_html += "<div class='achievements'>"+normalize_achievements(an_item_obj["achievements"])+"</div>";

              var an_item_info_html = "<div class='attached'>"+normalize_attached(an_item_obj["attached"])+"</div>";
              an_item_info_html += "<div class='keywords'><div class='title'>Keywords:</div>"+normalize_keywords(an_item_obj["keywords"])+"</div>";
              if (i%2 == 1) {
                an_item_html = "<td class='item'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info'>"+an_item_info_html+"</td>";
              }else {
                an_item_html = "<td class='item alternate'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info alternate'>"+an_item_info_html+"</td>";
              }

              $(".boxes tr:last").after("<tr>"+an_item_html+an_item_info_html+"</tr>");
              //display header
              $(".boxes .itemslist-header").css("visibility","visible");
            }
          }
        }
     });
  }

  function activities(){
    $.ajax({
        type: "GET",
        url: get_sec_conf('activities')['source'],
        dataType: "json",
        error: function() {},
        success: function(data) {
          if ("items" in data) {

            var cat = get_sec_conf('activities')['category'];
            var tabs = {}

            for (var i = 0; i < data["items"].length; i++) {
              var an_item_obj = data["items"][i];

              var an_item_html = "<div class='title'>"+an_item_obj["name"]+"</div>";
              an_item_html += "<div class='location'>"+an_item_obj["location"]+"</div>";
              an_item_html += "<div class='date'>From "+an_item_obj["start_date"]+" to "+an_item_obj["end_date"]+"</div>";
              an_item_html += "<div class='contribution'>"+an_item_obj["contribution"]+"</div>";
              an_item_html += "<div class='description'>"+an_item_obj["description"]+"</div>";

              var an_item_info_html = "<div class='attached'>"+normalize_attached(an_item_obj["attached"])+"</div>";
              an_item_info_html += "<div class='keywords'><div class='title'>Keywords:</div>"+normalize_keywords(an_item_obj["keywords"])+"</div>";

              if (i%2 == 1) {
                an_item_html = "<td class='item'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info'>"+an_item_info_html+"</td>";
              }else {
                an_item_html = "<td class='item alternate'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info alternate'>"+an_item_info_html+"</td>";
              }

              if (cat != undefined) {
                if (!(an_item_obj[cat]["value"] in tabs)) {
                  tabs[an_item_obj[cat]["value"]] = {"label": an_item_obj[cat]["label"], "rows": ""};
                }
                tabs[an_item_obj[cat]["value"]]["rows"] += "<tr class='tab-row'>"+an_item_html+an_item_info_html+"</tr>";
              }else {
                $(".boxes tr:last").after("<tr>"+an_item_html+an_item_info_html+"</tr>");
                //display header
                $(".boxes .itemslist-header").css("visibility","visible");
              }
            }

            if (Object.keys(tabs).length > 0){
              layout_config["nav_menu"]["activities"]["tabs"] = tabs;
              var header_tabs_html = "";
              for(var cat_obj in tabs) {
                header_tabs_html += "<span class='category'><a value='"+cat_obj+"'>"+tabs[cat_obj]["label"]+"</a></span>";
              }
              $(".boxes .itemslist-header div:last").after("<span class='tab-sep'>:</span>"+header_tabs_html);
              $(".boxes .itemslist-header").css("visibility","visible");
              $( ".boxes .itemslist-header .category a" ).on( "click", function() {
                $( ".boxes .itemslist-header .category a" ).removeClass( "active" );
                $( this ).addClass( "active" );
                $(".boxes tr.tab-row").remove();
                var tab_key = $( this ).attr("value");
                var tab_obj = layout_config["nav_menu"]["activities"]["tabs"][tab_key];
                //console.log( $( this ).attr("value"));
                $(".boxes tr:last").after(tab_obj["rows"]);
              });
              $( ".boxes .itemslist-header .category a:first" ).click();
            }

          }
        }
     });
  }

  function publications(){
    $.ajax({
        type: "GET",
        url: get_sec_conf('publications')['source'],
        dataType: "json",
        error: function() {},
        success: function(data) {

          if ("items" in data) {
            for (var i = 0; i < data["items"].length; i++) {
              var an_item_obj = data["items"][i];

              var an_item_html = "<div class='title'>"+an_item_obj["reference"]+"</div>";
              an_item_html += "<div class='link'><a href='"+an_item_obj["link"]+"'>"+an_item_obj["link"]+"</a></div>";

              var an_item_info_html = "<div class='keywords'><div class='title'>Keywords:</div>"+normalize_keywords(an_item_obj["keywords"])+"</div>";
              if (i%2 == 1) {
                an_item_html = "<td class='item'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info'>"+an_item_info_html+"</td>";
              }else {
                an_item_html = "<td class='item alternate'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info alternate'>"+an_item_info_html+"</td>";
              }

              $(".boxes tr:last").after("<tr>"+an_item_html+an_item_info_html+"</tr>");
              //display header
              $(".boxes .itemslist-header").css("visibility","visible");
            }
          }
        }
     });
  }

  return {
    head: head,
    footer: footer,
    homepage: homepage,
    shortbio: shortbio,
    projects: projects,
    activities: activities,
    publications: publications
  }
})();
