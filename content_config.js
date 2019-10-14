var my_config = {
  'dynamic_section':[
    {
      'id': 'diary',
      'section_title': "Working report",
      'section_type': 'report',
      'section_class': '',
      'url': 'https://ivanhb.github.io/edu/index/diary.json',
      'handler': report_handler,
    }
  ],
  'profile_section': {
    'id': 'profile',
    'source': 'https://ivanhb.github.io/doc/personal/bio.json',
    'section_title': 'About me',
    'section_type': 'profile',
    'section_class': 'profile',
    'normalize': {
      'description': normalize_md_to_html,
    },
    'layout':{
      "content": ['[[description]]']
    }
  },
  'section':[
      {
        'id': 'projects',
        'source': 'https://ivanhb.github.io/edu/index/project.json',
        'section_title': 'Projects',
        'section_type': 'gen-sec',
        'section_class': 'project',
        'normalize': {
          'achievements': normalize_achievements,
          'people': normalize_people,
          'date': date_to_status
        },
        //define the DOM layout pattern of each entity
        'layout':{
          "title": ['[[name]]'],
          "subtitle": ['[[sub_name]] <p>Status: [[date]]</p>'],
          "content": ['[[description]]<p>[[people]]</p><p>[[achievements]]</p>'],
          "extra": ['[[extra]]']
        }
      },
      {
        'id': 'activities',
        'source': 'https://ivanhb.github.io/edu/index/activity.json',
        'section_title': 'Activities',
        'section_type': 'gen-sec',
        'section_class': 'activity',
        'normalize': {
          'date': normalize_date_range,
        },
        //define the DOM layout pattern of each entity
        'layout':{
          "title": [
            '<div class="section_label">Event:&ensp;</div>[[name]]'
          ],
          "subtitle": [
            '<div class="section_label">Location:&ensp;</div>[[location]]',
            '<div class="section_label">Date:&ensp;</div>[[date]]',
            '<div class="section_label">Contribution:&ensp;</div>[[contribution]]'
          ],
          "content": [
            '<div class="section_label"></div>[[description]]'
          ],
          "extra": ['[[extra]]']
        }
      },
      {
        'id': 'publications',
        'source': 'https://ivanhb.github.io/edu/index/publication.json',
        'section_title': 'Publications',
        'section_type': 'gen-sec',
        'section_class': 'publication',
        'normalize': {
          'date': normalize_date,
        },
        //define the DOM layout pattern of each entity
        'layout':{
          "title": ['[[reference]]'],
          "subtitle": ['<a href="[[link]]">[[link]]</a>']
        }
      }
  ],
  'add_filter': true,
  'section_filter': {
    'date': {'label':"Date", 'all_label':"All Years", "range":true, "normalize": normalize_filter_date, "normalize_lbl": normalize_filter_date, "data_type": "int"}
  },
  'request': {
    'workdiary':{
      'link': "https://ivanhb.github.io/edu/index/diary.json",
      'query': {
          'last': last_diary
      }
    }
  }
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
