import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-get-data',
  templateUrl: './get-data.component.html',
  styleUrls: ['./get-data.component.css']
})
export class GetDataComponent implements OnInit {

  storagePalette:any;
  storageUI:any;
  palette:any;
  ui:any
  json:any = [];
  show:any;

  constructor() {}

  // construct JSON File
  saveText(text:any, filename:any){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
  }

  // function fired when user hits download button
  save(){
    this.saveText( JSON.stringify(this.json, null, 4), "color_palette.json" );
  }

  ngOnInit(): void {
  this.show = false;
    // Get all local storage values
  this.storagePalette = localStorage.getItem("storagePalette");
  this.storageUI = localStorage.getItem("storageUI");

      // check both local storage keys to see if they exist
      if(this.storageUI != null){
        this.ui = JSON.parse(this.storageUI);
      }

      if(this.storagePalette != null){
        this.palette = JSON.parse(this.storagePalette);
      }

  // first check if there are any colors in the palette
  // from which the JSON data needs to be built
  if(this.palette != undefined){

    // for loop to construct JSON output
    for(let i=0; i<this.palette.length; i++){
      var color
      var hex;
      var cmyk;
      var image;
      var elName = {};
      var outer;

      if(this.palette[i] != undefined){
        color = this.palette[i].name;
        hex = this.palette[i].hex;
        cmyk = this.palette[i].cmyk
        image = this.palette[i].imageUrl;

        let inner = {"Color":color,"Hex":hex,"CMYK":cmyk, "Image URL": image};

        // had to hardcode this part because the variables were not rendering
        // as strings when looping through the values
        if(i==0){outer = {"Background":inner};}
        if(i==1){outer = {"Header":inner};}
        if(i==2){outer = {"Menu":inner};}
        if(i==3){outer = {"Main":inner};}
        if(i==4){outer = {"Aside":inner};}
        if(i==5){outer = {"Footer":inner};}

        this.json.push(outer);
      }
      
    } 
    
  }
  
  // decide what the user sees, depending on whether there is data or not
  let output = document.getElementById("output")
  var result;
  if(this.palette != null && this.palette[0] != undefined){
    result = JSON.stringify(this.json, undefined, 2);
    this.show = true;
  }else{
    result = "Please add between 1-6 colors under 'Home' to see JSON output here."
  }
  if(output != null){
    output.textContent = result;
  }

      
  }

}
