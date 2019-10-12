
var pending = 0;
var PROF_SEC = "";
var SECTIONS_DOM = {};
var SECTIONS_OBJ = {};
var SECTION_PROFILE = {};
var SECTIONS_PROFILE_DOM = {};
var SLIDERS = {};
var SUITABLE_SECTIONS = {}

function build_dynamic_section(dynamic_sec_obj) {
  for (var i = 0; i < my_config["dynamic_section"].length; i++) {
    var a_d_sec = my_config["dynamic_section"][i];
    var window_div = document.createElement("div");
    window_div.id = a_d_sec["id"];
    window_div.classList.add("window",a_d_sec["section_type"]);
    window_div.innerHTML = '<div class="header">'+a_d_sec["section_title"]+'</div><div class="body"></div><div class="footer"></div>'
    document.getElementById("dynamic_section").appendChild(window_div);
    $.ajax({
        type: "GET",
        url: a_d_sec["url"],
        dataType: "json",
        async: false,
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
            str_html_content = str_html_content + "<div id='full_text'><a href='"+an_item["link"]+"'>Read report</a></div></div>";
            //console.log(str_html_content);
            $("#"+id+" .body")[0].innerHTML = $("#"+id+" .body")[0].innerHTML + str_html_content;

            _call_for_content(handler, _items, id, index + 1)
          }
      });
  }
}

function handle_req(type_req, res_req, request_obj) {
  if (request_obj != undefined) {
    if (type_req in request_obj) {
      var link = request_obj[type_req]["link"];

      if (res_req in request_obj[type_req]["query"]) {
        var fun_to_call = request_obj[type_req]["query"][res_req];
        $.ajax({
            type: "GET",
            url: link,
            dataType: "json",
            async: false,
            success: function(data) {
              //console.log(data);
              var redirect_href = Reflect.apply(fun_to_call,undefined,[data]);
              if (redirect_href != -1) {
                window.location.replace(redirect_href);
              }
            }
         });
      }
    }
  }
}

function get_entities_and_build_sec(list_sec_obj, i){
  var sec_obj = list_sec_obj[i];
  var sec_type = sec_obj["section_type"];
  $.ajax({
      type: "GET",
      url: sec_obj["source"],
      dataType: "json",
      error: function() {
        pending -= 1;
      },
      success: function(data) {
        pending -= 1;
        if (sec_type == "profile") {
          SECTION_PROFILE[sec_obj["id"]] = data["items"];
        }else {
          SECTIONS_OBJ[sec_obj["id"]] = data["items"];
        }
        //BUILD THE DOM FOR THE SECTION///
        var str_html = build_sec_dom(sec_obj, data["items"]);

        if (sec_type == "profile") {
          SECTIONS_PROFILE_DOM[sec_obj["id"]] = str_html;
        }else {
          SECTIONS_DOM[sec_obj["id"]] = str_html;
        }

        if (pending == 0) {
          build_page();
        }else {
          get_entities_and_build_sec(list_sec_obj, i+1)
        }
      }
   });
}

//returns the HTML string of all the section
function build_sec_dom(sec_obj, list_obj){
   var sec_order = null;
   var layout = sec_obj["layout"];
   if (sec_obj["section_type"] == "profile") {
     var an_entity = list_obj[0];
     document.getElementById("aboutme_section_header").innerHTML = sec_obj["section_title"] + '<div id="aboutme_section_contacts"></div>';


     var str_all_subsec = "";
     if ("image" in an_entity) {
       image_dom = '<img id="profile_img" class="ui circular image img-thumbnail bordered" src="'+an_entity["image"]+'">';
       str_all_subsec =  str_all_subsec + image_dom;
     }
     sec_order = ["title","subtitle","content"];
     for (var j = 0; j < sec_order.length; j++) {
       if(sec_order[j] in layout){
         var str_subsec = "";
         for (var k = 0; k < layout[sec_order[j]].length; k++) {
               var normalized_subsec = layout[sec_order[j]][k];
               var att = get_atts_regex(normalized_subsec, an_entity);

               for (var i_at = 0; i_at < att.length; i_at++) {
                 a_k = Object.keys(att[i_at])[0];

                 var replaced_val = att[i_at][a_k];
                 if (replaced_val == null) {replaced_val = "";}
                 if (a_k in sec_obj["normalize"]) {
                   replaced_val = Reflect.apply(sec_obj["normalize"][a_k],undefined,[replaced_val]);
                 }
                 normalized_subsec = normalized_subsec.replace("[["+a_k+"]]", replaced_val);
               }
               str_subsec = str_subsec + "<div id="+k+">"+normalized_subsec+"</div>";
          }
          str_all_subsec = str_all_subsec + "<div class="+sec_order[j]+">"+str_subsec+"</div>";
          document.getElementById("aboutme_section_"+sec_order[j]).innerHTML = str_all_subsec;
       }
     }

     //build the contact links
     var str_html_contacts = "";
     for (var contact_k in an_entity["contacts"]) {
       var href_contact = an_entity["contacts"][contact_k];
       var logo_class = null;
       switch (contact_k) {
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
        case "university email":
          logo_class = "envelope big icon";
          break;
       }
       if (logo_class != null) {
         str_html_contacts = str_html_contacts + '<a href="'+href_contact+'"><i class="'+logo_class+'"></i></a>';
       }
     }
     //str_html_contacts = "<div id='aboutme_section_contacts'>"+ str_html_contacts +"</div>";

     //build the extra components
     var str_html_extras = "";
     for (var i = 0; i < an_entity["extra"].length; i++) {
       var extra_item = an_entity["extra"][i];
       str_html_extras = str_html_extras + _build_extra_item(extra_item);
     }
     //str_html_extras = "<div id='aboutme_section_extra'>"+ str_html_extras +"</div>";


     document.getElementById("aboutme_section_extra").innerHTML = str_html_extras;
     document.getElementById("aboutme_section_contacts").innerHTML = str_html_contacts;
     return document.getElementById("aboutme_section").innerHTML;
   }

   sec_order = ["title","subtitle","content","extra","separator"];
   var str_list_items = "<div id='"+sec_obj["id"]+"' class='"+sec_obj["section_type"]+" "+sec_obj["section_class"]+"'>";
   str_list_items = str_list_items + "<div class='sec-header'>"+sec_obj["section_title"]+"</div>"+"</div><div class='section-separator'></div>";
   str_list_items = str_list_items + "<div class='sec-body "+sec_obj["id"]+"'>";
   for (var i = 0; i < list_obj.length; i++) {
     var an_entity = list_obj[i];
     var str_all_subsec = "";

     //check all sections and build the final HTML string
     for (var j = 0; j < sec_order.length; j++) {
       if(sec_order[j] in layout){
         var str_subsec = "";
         for (var k = 0; k < layout[sec_order[j]].length; k++) {
           var normalized_subsec = layout[sec_order[j]][k];

           //get the list of attributes
           var att = get_atts_regex(normalized_subsec, an_entity);

           if(sec_order[j] != "extra"){
             //replace the values in normalized string

             for (var i_at = 0; i_at < att.length; i_at++) {
               a_k = Object.keys(att[i_at])[0];
               var replaced_val = att[i_at][a_k];
               if (replaced_val == null) {
                 replaced_val = "";
               }
               if (a_k in sec_obj["normalize"]) {
                 replaced_val = Reflect.apply(sec_obj["normalize"][a_k],undefined,[replaced_val]);
               }

               normalized_subsec = normalized_subsec.replace("[["+a_k+"]]", replaced_val);
             }
           }else {
             //console.log(att);
             var extra_str_dom = "";
             for (var i_at = 0; i_at < att.length; i_at++) {
               a_k = Object.keys(att[i_at])[0];
               for (var ex_i = 0; ex_i < att[i_at][a_k].length; ex_i++) {
                 extra_str_dom = extra_str_dom + _build_extra_item(att[i_at][a_k][ex_i]);
               }
             }
             normalized_subsec = extra_str_dom;
           }

           str_subsec = str_subsec + "<div id="+k+">"+normalized_subsec+"</div>";
         }
         str_all_subsec = str_all_subsec + "<div class="+sec_order[j]+">"+str_subsec+"</div>";
       }
     }
     //add the new entity here
     var entity_id = i;
     if ("id" in an_entity) {
       entity_id = an_entity["id"];
     }
     str_list_items = str_list_items + "<div id='"+entity_id+"' class='sec-item'>"+str_all_subsec+"</div>";
   }
   str_list_items = str_list_items + "</div>";

   //return an HTML string with a list of all entites
   return str_list_items;

   function _build_extra_item(extra_item) {

     var str_extra_item = "";
     switch (extra_item["type"]) {
       case "git_repository":
         return '<a class="item_link" target="_blank"  href="'+extra_item["value"]+'"><i class="github alternate big icon"></i>'+extra_item["label"]+'</a>';
       case "presentation":
         return '<a class="item_link" target="_blank"  href="'+extra_item["value"]+'"><i class="eye big icon"></i>'+extra_item["label"]+'</a>';
       case "document":
         return '<a class="item_link" target="_blank"  href="'+extra_item["value"]+'"><i class="file outline big icon"></i>'+extra_item["label"]+'</a>';
       case "webpage":
         return '<a class="item_link" target="_blank"  href="'+extra_item["value"]+'"><i class="linkify big icon"></i>'+extra_item["label"]+'</a>';
       case "special":
         return '<a class="item_link" target="_blank"  href="'+extra_item["value"]+'"><i class="star big icon"></i>'+extra_item["label"]+'</a>';
       default:
          return '<a class="item_link" target="_blank"  href="'+extra_item["value"]+'"><div class="'+extra_item["type"]+'"></div>'+extra_item["label"]+'</a>';
     }
   }
}

function get_atts_regex(normalized_subsec, an_entity) {
  var att = [];
  var re_patt = /\[\[(\w*)\]\]/g;
  var match;
  while((match = re_patt.exec(normalized_subsec)) !== null) {
      var dict_att = {};
      dict_att[match[1]] = an_entity[match[1]];
      att.push(dict_att);
  }
  return att;
}

function build_page() {

    //Populate the GENRAL SECTION div
    var str_gen_section_str = "";
    //console.log(SECTIONS_DOM);
    for (var sec_id in SECTIONS_DOM) {
        str_gen_section_str = str_gen_section_str + SECTIONS_DOM[sec_id];
    }
    document.getElementById("sections").innerHTML = str_gen_section_str;

    //BUILD Dynamic sections


    /*BUILD slider filters*/
    var add_filter = null;
    if ("add_filter" in my_config) {
      add_filter = my_config["add_filter"]
    }
    if (add_filter) {

      /*the preview filter img */
      document.getElementById("filter_preview").innerHTML = '<img id="filter_preview_img" src="img/filter_pre.svg">';

      /*First the sections filter*/
      var str_slider_section = "";
      if (Object.keys(SECTIONS_OBJ).length > 1) {
        str_slider_section = '<div class="slider-filter"><div class="input-label">Section</div><div class="input-slider"><input type="text" id="slider_section" class="slider"></div></div>';
      }
      document.getElementById("sliders").innerHTML = str_slider_section;

      var sec_ids = get_arr_val_from_arr_obj(my_config["section"],"id");
      var sec_lbls = get_arr_val_from_arr_obj(my_config["section"],"section_title");
      var values_map = {};
      for (var i = 0; i < sec_lbls.length; i++) {
        values_map[sec_lbls[i]] = [sec_ids[i]];
      }
      values_map["All Sections"] = sec_ids;

      SLIDERS["slider_section"] = {
                "slider_obj": new rSlider({
                        target: '#slider_section',
                        values: ["All Sections"].concat(sec_lbls),
                        range: false,
                        set:    null, // an array of preselected values
                        width:    null,
                        scale:    true,
                        labels:   true,
                        tooltip:  true,
                        step:     null,
                        disabled: false,
                        onChange: function change_slider_section() {
                          build_att_filters();
                        }
                      }),
                "values_map": values_map,
      }

      /*Now build the DOM of the sections att filter*/
      if ('section_filter' in my_config) {
        for (var k_att in my_config['section_filter']) {
          var dom_elem = document.createElement("div");
          dom_elem.classList.add("slider-filter");
          dom_elem.innerHTML = '<div class="input-label">Section</div><div class="input-slider"><input type="text" id="slider_'+k_att+'" class="slider att_filter"></div>';
          document.getElementById("sliders").appendChild(dom_elem);

          SLIDERS["slider_"+k_att] = {
                    "slider_obj": new rSlider({
                            target: '#slider_'+k_att,
                            values: [""],
                            range: false,
                            disabled: true
                          }),
                    "values_map": [],
          }
        }
      }

      //Now populate the att sliders
      //build_att_filters();
    }
}

function build_att_filters() {
  //*Now check all the other filters*//
  if ('section_filter' in my_config) {
    for (var k_att in my_config['section_filter']) {
      var all_lbl = my_config['section_filter'][k_att]["all_label"];
      var normalize_fun = my_config['section_filter'][k_att]["normalize"];
      var normalize_lbl_fun = my_config['section_filter'][k_att]["normalize_lbl"];
      var data_type = my_config['section_filter'][k_att]["data_type"];
      var selected_lbl = SLIDERS["slider_section"]["slider_obj"].getValue();
      var sec_ids_selected = SLIDERS["slider_section"]["values_map"][selected_lbl];

      var suitable_res = gen_suitable_items(k_att, sec_ids_selected, normalize_fun, normalize_lbl_fun);
      var index_elems_value_maps = suitable_res[0];
      var index_elems = suitable_res[1];

      index_elems_value_maps[all_lbl] = index_elems;
      index_elems = [all_lbl].concat(index_elems);

      SLIDERS["slider_"+k_att]["values_map"] = index_elems_value_maps;

      var rslider_obj = {};
      if (index_elems.length == 1) {
        rslider_obj = {
          target: '#slider_'+k_att,
          values: index_elems,
          disabled: true,
        };
      }else if (index_elems.length == 0) {
          rslider_obj = {
            target: '#slider_'+k_att,
            values: [""],
            disabled: true,
          };
      }else if (index_elems.length > 0) {
        index_elems = order_arr(index_elems,data_type);
        rslider_obj = {
          target: '#slider_'+k_att,
          values: index_elems,
          range: false,
          set:    null, // an array of preselected values
          width:    null,
          scale:    true,
          labels:   true,
          tooltip:  true,
          step:     null, // step size
          disabled: false, // is disabled?
          onChange: function change_slider_section() {
            var selected_lbl = SLIDERS["slider_"+k_att]["slider_obj"].getValue();
            var corresponding_value = SLIDERS["slider_"+k_att]["values_map"][selected_lbl];
            var suitable_res = gen_suitable_items(k_att, sec_ids_selected, normalize_fun, normalize_lbl_fun, respects = corresponding_value);

            //console.log(SUITABLE_SECTIONS);
            var preview_menu = "";
            str_html = "";
            for (var sec_id in SUITABLE_SECTIONS) {
              var arr_ids = get_arr_val_from_arr_obj(my_config["section"], "id");
              var sec_obj = my_config["section"][arr_ids.indexOf(sec_id)];
              str_html = str_html + build_sec_dom(sec_obj, SUITABLE_SECTIONS[sec_id]);
              preview_menu = preview_menu + "<a href='#"+sec_id+"'>"+ sec_obj["section_title"]+"</a><div class='decoration point'></div>";
            }
            document.getElementById("filter_sections_menu").innerHTML = "<div id='pre_filter_menu' class='decoration'></div>"+preview_menu;
            document.getElementById("sections").innerHTML = str_html;
          }
        };
      }

      SLIDERS["slider_"+k_att]["slider_obj"].destroy();
      SLIDERS["slider_"+k_att]["slider_obj"] = new rSlider(rslider_obj);
    }
  }
}

function gen_suitable_items(k_att, sec_ids_selected, normalize_fun, normalize_lbl_fun, respects = null) {
  SUITABLE_SECTIONS = {};
  var index_elems_value_maps = {};
  var index_elems = [];
  for (var i = 0; i < sec_ids_selected.length; i++) {
    SUITABLE_SECTIONS[sec_ids_selected[i]] = [];
    for (var j = 0; j < SECTIONS_OBJ[sec_ids_selected[i]].length; j++) {
      var sec_item = SECTIONS_OBJ[sec_ids_selected[i]][j];
      if (k_att in sec_item) {

        SUITABLE_SECTIONS[sec_ids_selected[i]].push(sec_item);

        //make the function to normalize
        var res_arr = Reflect.apply(normalize_fun,undefined,[sec_item[k_att]]);
        var res_arr_lbl = Reflect.apply(normalize_lbl_fun,undefined,[sec_item[k_att]]);
        for (var res_i = 0; res_i < res_arr.length; res_i++) {
          if (index_elems.indexOf(res_arr_lbl[res_i]) == -1) {
            if (respects != null) {
              if (intersect(res_arr,respects).length == 0) {
                SUITABLE_SECTIONS[sec_ids_selected[i]].pop();
                continue;
              }
            }
            index_elems.push(res_arr_lbl[res_i]);
            index_elems_value_maps[res_arr[res_i]] = [res_arr_lbl[res_i]];
          }
        }
      }
    }
  }
  return [index_elems_value_maps, index_elems];
}


/*UTIL*/
function get_arr_val_from_list_obj(obj, val) {
  var arr_res = [];
  for (var k in obj) {
    for (var att in obj[k]) {
      if (att == val) {
        arr_res.push(obj[k][att]);
      }
    }
  }
  return arr_res;
}
function get_arr_val_from_arr_obj(arr_obj, val) {
  var arr_res = [];
  for (var i = 0; i < arr_obj.length; i++) {
    if (val in arr_obj[i]) {
      arr_res.push(arr_obj[i][val]);
    }
  }
  return arr_res;
}
function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}
function order_arr(arr, data_type) {
  switch (data_type) {
    case "int":
      return arr.sort(function(a, b){return a-b});
  }
}
