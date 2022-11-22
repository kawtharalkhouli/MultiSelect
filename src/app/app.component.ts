import { Component, OnInit } from '@angular/core';
export class City {
  id: number;
  name: string;
  isSelected: boolean;
}

interface CheckAllCheckbox{
  isSelected:boolean;
}
interface ToggleMenu{
  isClicked: boolean;
}
interface AllSelected{
  
  isMasterSelected:boolean
}
interface CheckedItems{
  citiesChicked: string[];
  citiesDisplayed: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'multi-select-reactive-form';
  isCheckboxSelected=false;
  isClicked=false;
  isMasterSelected=false;
  citiesChicked:string[] =[];
  citiesDisplayed:string[]=[];

  onToggleMenu(data: ToggleMenu):void{ this.isClicked=data.isClicked;}

  onCheckAllClick(data: CheckAllCheckbox):void{this.isCheckboxSelected=data.isSelected;}

  onAllSelected(data: AllSelected): void{this.isMasterSelected=data.isMasterSelected}

  onItemsChecked(data: CheckedItems): void{this.citiesChicked=data.citiesChicked, this.citiesDisplayed=data.citiesDisplayed}
  cities:City[]=[
    {id:1,name:'New York',isSelected:false},
    {id:2,name:'Rome',isSelected:false},
    {id:3,name:'London',isSelected:false},
    {id:4,name:'Istanbul',isSelected:false},
    {id:5,name:'Paris',isSelected:false}
  ];

  config={
    "isContainImages": "true or false", // images must be named images (to avoid conflicts),
    "chosenFelid" : "string",
    }

  ngOnInit(): void {
    console.log(this.cities)

  }
}
