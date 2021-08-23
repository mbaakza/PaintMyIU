import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {LocalStorageService } from 'ngx-webstorage';
import { ColorApiService } from '../services/color-api.service';
import { Observable, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [ColorApiService]
})

export class ColorPickerComponent implements OnInit {
  title = 'Color My UI';
  color:string = '';
  changedColor:string = '#8625df';
  palette:any = [];
  colorPicked:any;
  storage: any;
  storagePalette: any;
  storageUI:any;
  storageColorList:any;
  newColor: any;
  count:any = "";
  show:any;
  ctx:any;
  canvas:any;
  err:any;
  btn:any;
  gMessage:any;
  message:string = "Colors were removed (add more to view gradient).";

  // names and default colors for HTML elements when initialized
  ui = [
    {'name':'Header', 'color':'#cccccc'},
    {'name':'Menu', 'color':'#cccccc'},
    {'name':'Main', 'color':'#cccccc'},
    {'name':'Aside', 'color':'#cccccc'},
    {'name':'Footer', 'color':'#cccccc'}
  ]
  bg = '#000000';

  // used as the array that receives the drag n drop trashed tile values
  mockArray = JSON.parse(JSON.stringify(this.palette));
  
  private searchTerms: Subject<string> = new Subject<string>();

  constructor(private colorService: ColorApiService) {
    storage:LocalStorageService; 
  }

  // called when needing to pull current 
  // localStorage values for the color palette
  getStorage():any{
    let svals = localStorage.getItem("storagePalette");
    if(svals != null){
      svals = JSON.parse(svals);
    }
    else{
      svals = null;
    }
    return svals;
  }

  // used to determine if the color palette progress section
  // should be visible or hidden
  getShowStatus(){
    let sVals = this.getStorage();

    if(sVals){
      this.show = true;
    }else{
      this.show = false;
    }
  }
  
  // reset buttom
  clear(){
    localStorage.clear();
    location.reload();
    this.getShowStatus()
  }

  setNewValue(newColor: string): void {
	  this.searchTerms.next(newColor);
	}

  trackByFn(index: number, item: any): number {
    return index; 
  } 

  setOrigin(hex: string): void {
	  this.searchTerms.next(hex);
	}

  // called when user clicks 'add' after selecting a color from
  // the color picker; establishes the color palette from which
  // the entire app functionality is derived
  addToPalette(color: any):void{
    this.gMessage = "";
    this.drawGradient();
    let obj;

    let sVal = this.getStorage();
    if(sVal != null){
      this.palette = sVal;
    }

    if(this.palette == null){
      this.palette = []; 
    }

    if(this.palette.length < 6){

      // calls the service that gets external API data
      this.colorService.getColorData(this.color)
      .subscribe(result => {
              obj = {
                'hex': result.hex.value, 
                'name': result.name.value,
                'imageUrl': result.image.named,
                'cmyk': result.cmyk.value
              }
      this.searchTerms.pipe(
		  
      	switchMap((origin: string) => {
          this.color = color;          
        	return this.colorService.getColorData(color);
      	})
  	)
               
    this.palette.push(obj);
    
    localStorage.setItem("storagePalette",JSON.stringify(this.palette));
     
    // updates everything the user sees when a color is added
    this.drawGradient();
    this.paintUI();
    this.count = this.getCount();
    this.getShowStatus();
    });
  }
  else{
    console.log("palette length 6, color not added");
    this.color = this.palette[5].hex;
    this.err = "Limit of 6 - to add more, drag one or more tiles to Trash Zone first";
  }
  this.count = this.getCount();
  }

  // called to populate HTML elements with existing color palette values
  paintUI(){

    for(let i=0; i<this.palette.length; i++){
      if(i==0){
        if(this.palette[i] != undefined || this.palette[i] != null){
          this.bg = this.palette[i].hex;
        }
      }
      else {
          this.ui[i-1].color = this.palette[i].hex;
      }
    }

    localStorage.setItem("storageUI",JSON.stringify(this.ui));
  }
  
// Called when gradient needs to be drawn or re-drawn on the canvas
// such as when colors are added or removed 

  drawGradient(){
  var length = this.palette.length;
   
    var x = 0;
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    
    this.ctx = this.canvas.getContext('2d'); 
    
    // gradient width is dynamic depending on how many tiles there are
    let attr = (length * 100);
    this.canvas.setAttribute("width", attr.toString());

    if(this.ctx != null){
      let n = (1 / (length-1));
      let step = 0;
      var grd = this.ctx.createLinearGradient(0,0,attr,0);

      // build gradient with loop (took lots of trial and error!)
      for(let i=1; i<length+1; i++){
        if(i == 1)      {step = 0;} 
        if(i == length) {step = 1;}

        grd.addColorStop(step, this.palette[i-1].hex);
        
        if(length>2)    {step += n;} 
      }

      this.ctx.fillStyle = grd;
      this.ctx.fillRect(0,0,attr,50);
    }
   
  }

  // determines what the paint bucket color should be on the UI at all times
  getColor(): void{

    if(this.show==false){
      this.color = '#CCCCCC'
    }

    let col = this.color;
    
    if(this.storagePalette && this.storagePalette != []){
      this.palette = JSON.parse(this.storagePalette); 

      if(this.color != '#CCCCCC'){
        this.color = col;
      }
      else{
        if(this.palette[0] != undefined){
          this.color = this.palette[this.palette.length-1].hex;
        }
      
      this.getShowStatus()}
    }
    else{
      this.color='#CCCCCC';
    }
   
  }  

// function for horizontal drag and drop functionality
// to re-arrange color tile order
drop(event: CdkDragDrop<string[]>) {
  this.drawGradient();
  let num = event.previousIndex;
  this.color = this.palette[num].hex;

  // drops tiles in the same container they're in, horizontally
  moveItemInArray(this.palette, event.previousIndex, event.currentIndex);
  localStorage.setItem("storagePalette",JSON.stringify(this.palette));
  
  this.drawGradient();
  
  this.paintUI();
}


// Called when a color tile is dragged and dropped in the trash box 
colorDrop(event: CdkDragDrop<string[]>) {

  let pVals = this.getStorage();

  let index = event.previousIndex;
  let hex = this.palette[index].hex; 
  
  // Angular drag n drop event handling
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);
  }
 
  this.updateUI(index);
  
  // removing the last tile requires special instruction to avoid glitching
  if(index==0 && pVals[1]==undefined){ 
    console.log("hit");
    this.palette = [];
    this.gMessage = this.message;
    this.paintUI();
  }

 this.count = this.getCount();
 if(this.palette.length<6){
   this.err="";  
 }

this.color = hex;
this.drawGradient();

localStorage.setItem("storagePalette",JSON.stringify(this.palette));

}

// called from inside the above function
// updates the UI after a color is deleted
updateUI(index:number){

  if(index==0){

    if(this.ui[0].color == '#CCCCCC'){
      this.bg = '#000000';
    }else{

      if(this.palette[0] == undefined){
        this.bg = '#000000';
      }else{
        this.bg = this.ui[0].color;
      }
    }
 
    for(let i=0; i<this.ui.length; i++){

      if(i == this.ui.length - 1){
        this.ui[i].color = '#CCCCCC';
      }
      else{
        this.ui[i].color = this.ui[i+1].color;
      }
    }
  }

  if(index>0) {

    var currentColor;
    var nextColor;

    for(let i=0; i<this.ui.length; i++){

      if(i == index - 1){
        this.ui[i].color = '#CCCCCC'
      }

      // index = 1 or 2 or 3 or 4
      if(index > 0 && index < this.palette.length){
          currentColor = this.ui[i].color;

          if(this.ui[i+1]){
          nextColor = this.ui[i+1].color;
          }
          else{
            nextColor = '#CCCCCC';
          }

        if(i == index){
          this.ui[i-1].color = currentColor;
          this.ui[i].color = nextColor; 
        }
        if(i > index){
          this.ui[i].color = nextColor; 
        }
      }

      if(i == index && index == 0){
          this.ui[i-1].color = '#CCCCCC'
      }
    }
  }

  if(this.palette[0] == null){
   
    this.count = this.getCount();
    this.getColor();
  }

  localStorage.setItem("storagePalette",JSON.stringify(this.palette));
  localStorage.setItem("storageUI",JSON.stringify(this.ui));
}

// determines the number shown to the user regarding how many
// of the six-color-limit the user has accomplished
getCount(){
  let message = this.palette.length + " / 6 Selected";
  let more = 6 - this.palette.length;
  let drag = " (drag tiles sideways to re-arrange)"
  let add = " | Add " + more + " More "
  if(this.palette.length<6 && this.palette.length > 1){
    return message + add + drag;
  }
  if(this.palette.length < 2){
    return message + add;
  }else{
    return message + drag;
  }
  
}

// The default color for the paint bucket icon
getDefaultHex(){
  return "#CCCCCC"
}


ngOnInit(): void {  

 this.getColor();
  if(this.canvas != null){
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  }
   
  this.count = this.getCount();

  // Get all local storage values
  this.storagePalette = localStorage.getItem("storagePalette");
  this.storageUI = localStorage.getItem("storageUI");

  // Compose the UI if from storage if storage exists
    if(this.storagePalette != null){
      this.palette = JSON.parse(this.storagePalette);
      this.ui = JSON.parse(this.storageUI);
      this.paintUI();
      this.drawGradient();
      this.count = this.getCount();
      this.getShowStatus();

      if(this.palette[0] == undefined){
        this.gMessage = this.message;
      }
      
    }   
}  

// Initialize HTML Canvas before giving it context, otherwise get error
ngAfterViewInit(): void{
  this.drawGradient();
 }

}
