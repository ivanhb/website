var layout_config = {
  "homelogo": {link: "https://ivanhb.github.io/data/img/ivan_logo_extended.svg"},
  'homepage': "https://ivanhb.github.io/website/",
  'pages_dir': "https://ivanhb.github.io/website/page/",
  "nav_menu": {
    "bio": {title: "Short Biography", link: "bio.html"},
    "projects": {title: "Projects", link: "projects.html"},
    "activities": {title: "Activities", link: "activities.html"},
    "publications": {title: "Publications", link: "publications.html"}
  },
  "dynamic_section": {
    //in pixels
    "top_margin": 70,
    "header_height": 60,
    "max_height": 300
  }
}

var my_config = {
  'BASE': "https://ivanhb.github.io/",
  'WEBSITE_BASE': "https://ivanhb.github.io/website/",

  'dynamic_section':[
    {
      'id': 'diary',
      'url': 'https://ivanhb.github.io/edu/index/diary.json',
      'handler': report_handler
    }
  ],
  'section':[
      {
        'id': 'bio',
        'source': 'https://ivanhb.github.io/edu/index/bio.json'
      },
      {
        'id': 'projects',
        'source': 'https://ivanhb.github.io/edu/index/project.json'
      },
      {
        'id': 'activities',
        'source': 'https://ivanhb.github.io/edu/index/activity.json',
        //use the attribute "type" to build several tabs
        'category': 'type'
      },
      {
        'id': 'publications',
        'source': 'https://ivanhb.github.io/edu/index/publication.json'
      }
  ]
}

function normalize_people(d) {
  var str_to_return = "";
  for (var i = 0; i < d.length; i++) {
    str_to_return = str_to_return +"<li style='list-style:none;'><i class='user small icon'></i><a href='"+d[i]["link"]+"'>"+d[i]["title"]+" - "+d[i]["affiliation"]+"</a></li>";
    if (i == d.length - 1) {
      str_to_return = "<div class='subtitle'>People</div>"+str_to_return;
    }
  }
  return str_to_return;
}

function normalize_achievements(d) {
  var str_to_return = "";
  for (var i = 0; i < d.length; i++) {
    str_to_return = str_to_return + "<li style='list-style:none;'><i class='check small icon'></i>"+d[i]+"</li>";
    if (i == d.length - 1) {
      str_to_return = "<div class='subtitle'>Achievements</div>"+str_to_return;
    }
  }
  return str_to_return;
}

function normalize_date(d) {
  // e.g. 02/15/2017
  const months = {
    "01": "Jan.",
    "02": "Feb.",
    "03": "Mar.",
    "04": "Apr.",
    "05": "May.",
    "06": "Jun.",
    "07": "Jul.",
    "08": "Aug.",
    "09": "Sep.",
    "10": "Oct.",
    "11": "Nov.",
    "12": "Dec."
  };

  var str_date = "";
  if (d != "") {
      if (d == "ongoing"){
        str_date = "ongoing";
      }else {
        var d_parts = d.split("/");
        if(d_parts.length > 1){
          d_parts[1] = months[d_parts[1]];
        }
        for (var i = d_parts.length - 1; i >= 0; i--) {
          str_date = " "+d_parts[i] + str_date;
        }
      }
  }
  return str_date;
}

function normalize_md_to_html(str_md){
  var md = new Remarkable();
  var html_str = md.render(str_md);
  return html_str;
}

function normalize_keywords(elems){
  var elems_html = "";
  if (elems != undefined) {
    for (var i = 0; i < elems.length; i++) {
      //elems_html += "#"+elems[i];
      elems_html += elems[i];
      if (i < elems.length -1) {
        elems_html += "<i class='circle icon'></i>";
      }
    }
  }
  return elems_html;
}

function normalize_attached(elems){

  var elems_html = "";
  if (elems != undefined) {
      for (var i = 0; i < elems.length; i++) {
        var elem_obj = elems[i];

        var logo_class = "";
        switch (elem_obj["type"]) {
         case "git_repository":
            logo_class = "github alternate icon";
            break;
         case "presentation":
            logo_class = "eye icon";
            break;
         case "special":
            logo_class = "star icon";
            break;
         case "webpage":
            logo_class = "linkify icon";
            break;
         case "document":
            logo_class = "file outline icon";
            break;
        }

        elems_html += '<div class="item-link"><a target="_blank"  href="'+elem_obj["value"]+'"><i class="'+logo_class+'"></i>'+elem_obj["label"]+'</a></div>';
        if (i < elems.length -1) {
          elems_html += '<div class="separator"><i class="minus icon"></i></div>';
        }
      }
  }
  return elems_html;
}

function normalize_contacts(elems) {

  var elems_html = "";
  if (elems != undefined) {
    for (var k_contact in elems) {
      var obj_contact = elems[k_contact];
      if ("include_in_webpage" in obj_contact) {
        if (obj_contact["include_in_webpage"] == 1) {

          var logo_class = "";
          switch (k_contact) {
            case "twitter":
             logo_class = "twitter big icon";
             break;
           case "git":
             logo_class = "github big icon";
             break;
           case "facebook":
             logo_class = "facebook big icon";
             break;
           case "linkedin":
             logo_class = "linkedin big icon";
             break;
           case "university_email":
             logo_class = "envelope big icon";
             break;
           case "orcid":
            logo_class = "pencil alternate big icon";
             break;
           default:
             logo_class = "envelope big icon";
             break;
          }
          elems_html += '<div class="item"><a href="'+obj_contact["value"]+'"><i class="'+logo_class+'"></i><span class="after-logo">'+obj_contact["label"]+'</span></a></div>';
        }
      }
    }
  }
  return elems_html;
}

function last_diary(diary_obj) {
  var items = diary_obj["items"];
  if (items.length > 0) {
    return items[0]["link"]
  }
  return -1;
}

function report_handler(an_item) {
  //{"content": , "date": }
  //console.log(an_item);
  //const regex = /<h2 id=\".*\"\>(.*)\<a.*><\/h2>/gm;
  const regex = /<h2.*id="[^\s]*">(.*)<\/h2>/gm
  //const regex = /^\#\#(.*)\n/gm

  var match;
  var parser = new DOMParser();
  var content = [];
  var html_elem;
  while((match = regex.exec(an_item["html_content"])) !== null) {
	    var html_elem = parser.parseFromString(match[0], 'text/html').body;
      console.log(html_elem.innerHTML);
      content.push(match[1]);
  }
  var normalized_item = {
    "date":  normalize_date(an_item["date"]),
    "content": content
  }
  return normalized_item;
}

function build_dynamic_section(dynamic_sec_obj) {
  for (var i = 0; i < my_config["dynamic_section"].length; i++) {
    var a_d_sec = my_config["dynamic_section"][i];
    var window_div = document.createElement("div");
    window_div.id = a_d_sec["id"];
    window_div.classList.add("window",a_d_sec["section_type"]);
    window_div.innerHTML = '<div class="body"></div><div class="footer"></div>'
    document.getElementById("dynamic_section").appendChild(window_div);
    $.ajax({
        type: "GET",
        url: a_d_sec["url"],
        dataType: "json",
        async: true,
        success: function(data) {
          _call_for_content(a_d_sec["handler"],data["items"],a_d_sec["id"], 0);
        }
     });
  }

  function _call_for_content(handler, _items, id, index) {
    if (index == _items.length) {
      return true;
    }
    var an_item = _items[index];
    $.ajax({
          type: "GET",
          url: an_item["link"],
          //dataType: "html",
          async: true,
          success: function(data) {
            var normalize_item = {"date": an_item["date"], "html_content": data}
            var normalized_item = Reflect.apply(handler,undefined,[normalize_item]);

            var str_html_content = "<div class='item_title'>"+normalized_item["date"]+"</a></div><div class='item_content'>";
            for (var j = 0; j < normalized_item["content"].length; j++) {
              str_html_content = str_html_content + "<li>"+normalized_item["content"][j]+"</li>";
            }
            str_html_content = str_html_content + "<li id='full_text'><a href='"+an_item["link"]+"'>Read the full report</a></li></div>";
            //console.log(str_html_content);
            $("#"+id+" .body")[0].innerHTML = $("#"+id+" .body")[0].innerHTML + str_html_content;

            _call_for_content(handler, _items, id, index + 1)
          }
      });
  }
}

function get_sec_conf(sec_id){
  for (var i = 0; i < my_config['section'].length; i++) {
    if(my_config['section'][i]["id"] == sec_id){
      return my_config['section'][i];
    }
  }
  return -1;
}
