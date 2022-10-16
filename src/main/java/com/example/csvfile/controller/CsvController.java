package com.example.csvfile.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Controller
public class CsvController {
	
	
  @GetMapping
  public String start()
  {
	  return "home";
  }
  
  @RequestMapping(value = "/tables/{table_name}", method = RequestMethod.GET)
  public String tableDataController(Model model, @PathVariable("table_name") String table_name) {
	  
	  List<Map<String,Object>> tables =  getTables();
	  model.addAttribute("tables", tables);
	  
	  List<Map<String,Object>> data =  getData(table_name);
	  model.addAttribute("data", data);
	
	  return "tables";
  }


@GetMapping("/tables")
  public String tableController(Model model)
  {
	  List<Map<String,Object>> result =  getTables();
	  
	  if(result.size() == 0) model.addAttribute("tables_not_existe", "No table added");
	 
	  if(result.size() > 0)
	  model.addAttribute("select_table", "please, select one table");	  
	  model.addAttribute("tables", result);
	  return "tables";
  }

  @RequestMapping(value = "save_table", method = RequestMethod.POST)
  public @ResponseBody String saveTablesController(@RequestBody JSONObject jsonObject) {
	
	  Object data = jsonObject.get("data");
	  Object columns = jsonObject.get("columns");
	  Object table_name = jsonObject.get("table_name");
	  

	String result = createTable(columns, table_name, data);
	
	  return result;
	  
  }
  
  public void deleteTable(Object table_name)
  {
		 
		  DriverManagerDataSource dataSource = dataSource();
	      
		  
		  JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		 
		  jdbcTemplate.execute("DROP TABLE IF EXISTS `" + table_name + "`");
		  
		  
	  
  }
  
  @RequestMapping("/check")
  public @ResponseBody String checkTable(@RequestParam(value="table_name") String table_name)  {

	  List<Map<String,Object>> result = getTables();
	  for (Map<String, Object> map : result) {
	    for (Map.Entry<String, Object> entry : map.entrySet()) {
	    	
	    	String value = (String) entry.getValue();
	    	
	    	if(value.equals(table_name))
	        {
	       return "existe";
	        }
	    }
	
	  }
      return "not existe";
  }
  
  
  public  String createTable(Object columns, Object table_name, Object data) 
  {
	
	  try {
	  DriverManagerDataSource dataSource = dataSource();
      
	  
	  JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
	
	
	  ArrayList column = (ArrayList) columns;
	  
	 jdbcTemplate.execute("CREATE TABLE `" + table_name +"` (id_auto_increment int AUTO_INCREMENT primary key)");
		 
	
	  for (int i = 0; i < column.size(); i++) { 
		  
		  ArrayList arl = (ArrayList) column.get(i);

		  jdbcTemplate.execute("ALTER TABLE `"  + table_name + "` ADD COLUMN `" + arl.get(0) + "` "  + arl.get(1));  
	
      }  
	 
	  List<String> list = new ArrayList<String>();
	  
for (int i = 0; i < column.size(); i++) { 
		  
		 ArrayList arl = (ArrayList) column.get(i);
		 list.add((String) "`" + arl.get(0) + "`");
		 		 
}

String str_columns = String.join(", ", list);
	  
 ArrayList columns_data = (ArrayList) data;
 
 ArrayList<Object> list_data = new ArrayList<Object>();
 ArrayList<Object> list2 = new ArrayList<Object>();
 
 
		for (int i = 1; i < columns_data.size(); i++) 
		{
			ArrayList arl = (ArrayList) columns_data.get(i);
			
			
			for (int j= 0; j < arl.size(); j++) {
				list2.add( "'"+ (Object) arl.get(j) + "'");
				
			}
			
			list_data.add((Object) list2);
			list2 = new ArrayList<Object>();
		}
		

for (int i = 0; i < list_data.size(); i++) { 
	 
 jdbcTemplate.execute("insert into `"+ table_name +"` ("+ str_columns +") values (" + list_data.get(i).toString().replace("[", "").replace("]", "") +")");
 } 
	return "success";
	  } catch (Exception e) {
	      deleteTable(table_name);
	      System.out.println(e);
	      return "error";
	    }
  }
  
  public List<Map<String,Object>> getData(String table_name) 
  {

	  DriverManagerDataSource dataSource = dataSource();
      
	  JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
	  
	  String sql = "Select * from `" + table_name + "`";
	  
	  List<Map<String,Object>> result = jdbcTemplate.queryForList(sql); 
	
	  return result; 
	  
  }
  
  public List<Map<String,Object>> getTables() {
	 
	 
	  DriverManagerDataSource dataSource = dataSource();
      
	  
	  JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
	  
	  String sql = "SHOW TABLES";
	  
	  List<Map<String,Object>> result = jdbcTemplate.queryForList(sql); 
	  
	  return result;
	  
  }
  
  
 // conntect to db 
  public DriverManagerDataSource dataSource()
  {
	  
	  DriverManagerDataSource dataSource = new DriverManagerDataSource();
      dataSource.setDriverClassName("com.mysql.jdbc.Driver");
      dataSource.setUrl("jdbc:mysql://localhost:3306/csvfile"); // change csvFile with database name
      dataSource.setUsername("root");  // database username
      dataSource.setPassword(""); // database password
      
      return dataSource;
	 
  }
 
  
}
