
//Check if I am requesting another resource
var myRegexp = /index\.html\?(.*)=(.*)/g;
var groups = myRegexp.exec(String(window.location.href));
var type_req = null;
var res_req = null;
if (groups != null) {
  if (groups.length > 1) {type_req = groups[1];}
  if (groups.length > 2) {res_req = groups[2];}
}

if (type_req != null) {
  handle_req(type_req, res_req, my_config['request']);
}


//Build Dynamic Sections
if ("dynamic_section" in my_config) {
  build_dynamic_section(my_config["dynamic_section"]);
}


//BUILD SECTIONS
//Number of all sections
var sections_to_call = [];
if (my_config['profile_section'] != undefined) {
  sections_to_call.push(my_config['profile_section']);
}
if (my_config['section'] != undefined) {
  sections_to_call = sections_to_call.concat(my_config['section']);
}
pending = sections_to_call.length;
get_entities_and_build_sec(sections_to_call,0);
