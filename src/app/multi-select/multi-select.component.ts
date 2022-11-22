import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface City{
  id:number,
  name:string,
  isSelected:boolean
}

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  @Input() data:City[] =[];
  @Input() configurations={};
  @ViewChild('selectMenu') selectMenu: ElementRef;
  isClicked=false;
  isMasterSel=false;
  checkedCitiesList:any; 
  selectedCity:any;
  length=0;
  filterdCities :City[]=[];
  filteredCity:any;
  myForm: FormGroup;
  cityValue:FormGroup;
  


  constructor(private formBuilder: FormBuilder,private renderer: Renderer2) {}
  
  // Getter method to access formcontrols
  get cityName() {
    return this.cityValue.get('cityName');
  }

  ngOnInit(): void {
    console.log(this.data)
    this.getCheckedCityList();
    this.filterdCities=this.data;
    console.log(this.filterdCities)
    this.cityValue=this.formBuilder.group({
    cityName:['']
   });
   console.log(this.configurations);

   
  }


  //Function to close and open menu whenever the close button is closed or the menu arrow is clicked
  toggleMenu():void{
    this.isClicked=!this.isClicked;
  }
  //Function triggered on the check all checkbox to select all checkboxes in the menu
  checkUncheckAll(){
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].isSelected = this.isMasterSel;
    }
    this.getCheckedCityList();
  }

  //Function triggered when all menu items are checked and the effect must be reflected on the check all checkbox
  isAllSelected() {
    this.isMasterSel = this.data.every(function(city:any) {
        return city.isSelected == true;
      })
    this.getCheckedCityList();
  }

  //Function to get the checked items from the menu to be displayed in the selected box

  getCheckedCityList(){
    this.checkedCitiesList = [];
    this.selectedCity=[];
    for (let i = 0; i < this.data.length; i++) {
      if(this.data[i].isSelected){
      this.checkedCitiesList.push(this.data[i]);
      this.selectedCity.push(this.data[i].name)
      }  
    }
    if(this.selectedCity.length===0)
    this.selectedCity.push("Select a City");
  
    if(this.selectedCity.length >3){
      this.length=this.selectedCity.length;
      this.selectedCity= this.length + " items Selected"
    }

    this.checkedCitiesList = JSON.stringify(this.checkedCitiesList);
    this.selectedCity =JSON.parse( JSON.stringify(this.selectedCity));
    console.log(this.checkedCitiesList);
    console.log(this.selectedCity);
  
  }

  //Function triggered when a search in conducted in the search box of the menu

  filterCities() {
    this.filterdCities = this.filteredCity===""? this.data : this.data.filter(
      item => {return item.name.toLowerCase().includes(this.filteredCity.toLowerCase())}
    );
    console.log(this.data)
    }



}
