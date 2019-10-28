var layout_config = {
  "homelogo": {link: "https://ivanhb.github.io/data/img/full_logo_vanilla.svg"},
  'homepage': "https://ivanhb.github.io/website/",
  'pages_dir': "https://ivanhb.github.io/website/page/",
  "nav_menu": {
    "projects": {title: "Projects", link: "projects.html"},
    "activities": {title: "Activities", link: "activities.html"},
    "publications": {title: "Publications", link: "publications.html"},
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
        'id': 'projects',
        'source': 'https://ivanhb.github.io/edu/index/project.json'
      },
      {
        'id': 'activities',
        'source': 'https://ivanhb.github.io/edu/index/activity.json'
      },
      {
        'id': 'publications',
        'source': 'https://ivanhb.github.io/edu/index/publication.json'
      }
  ]
}


function normalize_date_range(date_range){
  if (date_range == null) {
    return date_range;
  }
  var date_range_parts = date_range.split("-");
  //console.log(date_range_parts);
  for (var i = 0; i < date_range_parts.length; i++) {
    date_range_parts[i] = normalize_date(date_range_parts[i]);
  }
  var str_splitter = "";
  var str_date_range = "";
  if (date_range_parts.length > 0) {
    str_date_range = date_range_parts[0];
  }
  if (date_range_parts.length > 1) {
    str_date_range = str_date_range + "  to "+ date_range_parts[1];
  }
  return str_date_range;
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

function date_to_status(d) {
  var str_date = "";
  if (d != "") {
      var second_date = d.split("-")[1];
      var second_date_parts = second_date.split("/");
      var d_to = new Date(second_date_parts[2], second_date_parts[1] - 1, second_date_parts[0])
      var cur_date = new Date();
      if(d_to > cur_date) {
        str_date = "Ongoing (until: "+normalize_date(second_date)+")";
      }else {
        str_date = "Finished";
      }
  }
  return str_date;
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
      var d_parts = d.split("/");
      if(d_parts.length > 1){
        d_parts[1] = months[d_parts[1]];
      }
      for (var i = d_parts.length - 1; i >= 0; i--) {
        str_date = " "+d_parts[i] + str_date;
      }
  }
  return str_date;
}
function normalize_md_to_html(str_md){
  var md = new Remarkable();
  var html_str = md.render(str_md);
  return html_str;
}

//*must return an array of values*//
function normalize_filter_date(val){
  //05/07/2018
  var res = [];
  var parts = val.split("-");
  for (var i = 0; i < parts.length; i++) {
    var _year = _get_year(parts[i]);
    if (res.indexOf(_year) == -1) {
      res.push(_year);
    }
  }
  return res;
  function _get_year(val_date) {
    var parts = val.split("/");
    return parts[parts.length-1];
  }
}

function normalize_keywords(elems){
  var elems_html = "";
  if (elems != undefined) {
    for (var i = 0; i < elems.length; i++) {
      elems_html += "#"+elems[i];
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
  const regex = /<h2.*id=\".*\".*\>(.*)<\/h2>/gm

  var match;
  var content = [];
  while((match = regex.exec(an_item["html_content"])) !== null) {
      //console.log(match[1]);
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
          dataType: "html",
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
