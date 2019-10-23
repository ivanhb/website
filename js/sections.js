
var sections = (function () {

  function fixed(section="home") {
    var active = "";
    if (section == "home") {
      active = "active";
    }
    var nav_html = '<a class="item '+active+'" href="'+layout_config.homepage+'">Home</a>';
    active = "";
    for (var a_section in layout_config.nav_menu) {
      var sec_obj = layout_config.nav_menu[a_section];
      if (section == a_section) {
        active = "active";
      }
      nav_html = '<a class="item '+active+'" href="'+layout_config.pages_dir+sec_obj.link+'">'+sec_obj.title+'</a>'+ nav_html;
      active = "";
    }

    var homelogo = "";
    if ("homelogo" in layout_config) {
      if ("link" in layout_config["homelogo"]) {
        homelogo = "<img src='"+layout_config["homelogo"]["link"]+"'>";
      }
    }

    $("#menu").html(homelogo + nav_html);
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
             }
           }
    });

    //Build Dynamic Sections
    if ("dynamic_section" in my_config) {
      build_dynamic_section(my_config["dynamic_section"]);
    }
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
              an_item_html += "<div class='date'>"+date_to_status(an_item_obj["date"])+"</div>";
              an_item_html += "<div class='description'>"+an_item_obj["description"]+"</div>";
              an_item_html += "<div class='people'>"+normalize_people(an_item_obj["people"])+"</div>";
              an_item_html += "<div class='achievements'>"+normalize_achievements(an_item_obj["achievements"])+"</div>";

              var an_item_info_html = "<div class='keywords'><div class='title'>Keywords:</div>"+normalize_keywords(an_item_obj["keywords"])+"</div>";
              if (i%2 == 1) {
                an_item_html = "<td class='item'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info'>"+an_item_info_html+"</td>";
              }else {
                an_item_html = "<td class='item alternate'>"+an_item_html+"</td>";
                an_item_info_html = "<td class='item-info alternate'>"+an_item_info_html+"</td>";
              }

              $(".boxes tr:last").after("<tr>"+an_item_info_html+an_item_html+"</tr>");
              $(".boxes .description-header").css("visibility","visible");
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
            for (var i = 0; i < data["items"].length; i++) {
              var an_item_obj = data["items"][i];

              var an_item_html = "<div class='title'>"+an_item_obj["name"]+"</div>";
              an_item_html += "<div class='location'>"+an_item_obj["location"]+"</div>";
              an_item_html += "<div class='date'>"+normalize_date_range(an_item_obj["date"])+"</div>";
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

              $(".boxes tr:last").after("<tr>"+an_item_info_html+an_item_html+"</tr>");
              //display header
              $(".boxes .description-header").css("visibility","visible");
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

              $(".boxes tr:last").after("<tr>"+an_item_info_html+an_item_html+"</tr>");
              $(".boxes .description-header").css("visibility","visible");
            }
          }
        }
     });
  }

  return {
    fixed: fixed,
    homepage: homepage,
    projects: projects,
    activities: activities,
    publications: publications
  }
})();
