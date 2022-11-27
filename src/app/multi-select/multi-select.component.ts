import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output,  Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface City{
  id:number,
  name:string,
  isSelected:boolean
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
  selector: 'app-multi-select',
  template: ` 
  <form [formGroup]="cityValue" #multiSelectForm>
  <div class="body" #multiSelectBody >
      <div class="select-menu" #multiSelectMenu >
          <div class="select-btn" #multiSelectBtn  (click)="toggleMenu()" [ngClass]="{'select-clicked':isClicked === true}">
              <span class="select-btn-text" #selectText [innerText]="selectedCity"></span>
              <div class="arrow" #multiSelectArrow  [ngClass]="{'arrow-rotate':isClicked === true}"></div>
          </div>
          <ul class="options"  #multiSelectOptions [ngClass]="{'menu-open':isClicked === true, 'menu-closed':isClicked === false}" >
              <div class="search-options" #multiSelectSearchOptions>
                  <input type="checkbox" class="checkbox" #multiSelectAllCheckbox [(ngModel)]="isMasterSel" [ngModelOptions]="{standalone: true}" (change)="checkUncheckAll()">
                  <input type="text" class="search-box"  #searchText   [(ngModel)]="filteredData" [ngModelOptions]="{standalone: true}" (keyup) ="filterCities()">
                  <span><i #multiSelectCloseBtn class="fa fa-times"  (click)="toggleMenu()" [ngClass]="{'menu-open':isClicked === true}" ></i></span>
              </div>
               <li class="option" #multiSelectOption  *ngFor="let city of filterdData" [value]="city" formControlName="cityName" ngDefaultControl>
              <label class="optionText" #optionText>
                  <input type="checkbox" class="checkbox" #multiSelectSingleCheckbox (change)="isAllSelected()" [(ngModel)]="city.isSelected" [ngModelOptions]="{standalone: true}">
                  <img src="" #images *ngIf="configurations.isContainImages">
                  {{city.name}}
              </label>
          </li>       
          </ul>
      </div>
  </div>
</form>`,
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit , AfterViewInit{
  
  //Inputs
  @Input() customStyle: any[]=[];
  @Input() data:any =[];
  @Input() configurations:any;
  @Input() style:any; 

  //reference for html elements
  @ViewChild('multiSelectForm') multiSelectForm: ElementRef;
  @ViewChild('multiSelectBody') multiSelectBody: ElementRef;
  @ViewChild('multiSelectMenu') multiSelectMenu: ElementRef;
  @ViewChild('multiSelectBtn') multiSelectBtn: ElementRef;
  @ViewChild('multiSelectArrow') multiSelectArrow: ElementRef;
  @ViewChild('multiSelectOptions') multiSelectOptions: ElementRef;
  @ViewChild('multiSelectAllCheckbox')  multiSelectAllCheckbox: ElementRef;
  @ViewChild('searchText') multiSelectSearchBox: ElementRef;
  @ViewChild('multiSelectCloseBtn') multiSelectCloseBtn: ElementRef;
  @ViewChild('multiSelectOption') multiSelectOption: ElementRef;
  @ViewChild('optionText') multiSelectOptionText: ElementRef;
  @ViewChild('multiSelectSingleCheckbox') multiSelectSingleCheckbox: ElementRef;
  @ViewChild('images') images: ElementRef;
  @ViewChild('multiSelectSearchOptions') multiSelectSearchOptions: ElementRef;


  //Outputs
  @Output() onCheckAllClick: EventEmitter<CheckAllCheckbox> =new EventEmitter();
  @Output() onToggleMenu: EventEmitter<ToggleMenu> =new EventEmitter();
  @Output() onAllSelected: EventEmitter<AllSelected>=new EventEmitter();
  @Output() onItemsChecked: EventEmitter<CheckedItems>=new EventEmitter();
  isClicked=false;
  isMasterSel=false;
  checkedCitiesList:any; 
  selectedCity:any;
  length=0;
  filterdData :City[]=[];
  filteredData:any;
  myForm: FormGroup;
  cityValue:FormGroup;

  

  constructor(private formBuilder: FormBuilder,private renderer: Renderer2) {}
  
  // Getter method to access formcontrols
  get cityName() {
    return this.cityValue.get('cityName');
  }
  
  ngOnInit(): void {
    this.getCheckedCityList();
    this.filterdData=this.data;
    this.cityValue=this.formBuilder.group({cityName:['']});
  }
 
  ngAfterViewInit(){
    const elementRefs = [
      {
        multiSelectForm: this.multiSelectForm,
  
      },
      {
        multiSelectBody: this.multiSelectBody,
  
      },
      {
        multiSelectMenu: this.multiSelectMenu,
  
      },
      {
        multiSelectBtn: this.multiSelectBtn,
  
      },
      {
        multiSelectArrow: this.multiSelectArrow,
  
      },
      {
        multiSelectOptions: this.multiSelectOptions,
  
      },
      {
        multiSelectSearchOptions: this.multiSelectSearchOptions,
  
      },
      {
        multiSelectAllCheckbox: this.multiSelectAllCheckbox,
  
      },
      {
        multiSelectSearchBox: this.multiSelectSearchBox,
  
      },
      {
        multiSelectCloseBtn: this.multiSelectCloseBtn,
  
      },
      {
        multiSelectOption: this.multiSelectOption,
  
      },
      {
        multiSelectOptionText: this.multiSelectOptionText,
  
      },
      {
        multiSelectSingleCheckbox: this.multiSelectSingleCheckbox,
  
      }
    ]

    //renderer2 for custom style
 
    for(let i=0;i<this.customStyle.length;i++){
      for(let key in this.customStyle[i]){
        let attribute= Object.keys(this.customStyle[i][key]);
        let attributeValue= Object.values(this.customStyle[i][key]);
        console.log(attribute[0]);
        console.log(attributeValue[0]);
        this.renderer.setStyle(elementRefs[i],attribute[0] , attributeValue[0],1);
      } 
    }
    //renderer 2 for styling one element only 
    this.style.forEach((style)=>{
      for(let key in style){
        this.renderer.setStyle(this.multiSelectBtn.nativeElement, key , style[key],1);
       console.log(key, style[key])
      }
    })
  }
 
  
  //Function to close and open menu whenever the close button is closed or the menu arrow is clicked
  toggleMenu():void{
    this.isClicked=!this.isClicked;
    this.onToggleMenu.emit({isClicked:this.isClicked});
  }
  //Function triggered on the check all checkbox to select all checkboxes in the menu
  checkUncheckAll(){
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].isSelected = this.isMasterSel;
    }
    this.getCheckedCityList();
    this. onCheckAllClick.emit({isSelected:this.isMasterSel});
  }

  //Function triggered when all menu items are checked and the effect must be reflected on the check all checkbox
  isAllSelected() {
    this.isMasterSel = this.data.every(function(city:any) {
        return city.isSelected == true;
      })
    this.getCheckedCityList();
    this.onAllSelected.emit({isMasterSelected:this.isMasterSel});
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
    this.selectedCity.push("Select an Item");
  
    if(this.selectedCity.length >3){
      this.length=this.selectedCity.length;
      this.selectedCity= this.length + " items Selected"
    }

    this.checkedCitiesList = JSON.stringify(this.checkedCitiesList);
    this.selectedCity =JSON.parse( JSON.stringify(this.selectedCity));
    console.log(this.checkedCitiesList);
    console.log(this.selectedCity);
    this.onItemsChecked.emit({citiesChicked:this.checkedCitiesList, citiesDisplayed:this.selectedCity});
  
  }

  //Function triggered when a search in conducted in the search box of the menu

  filterCities() {
    this.filterdData = this.filteredData===""? this.data : this.data.filter(
      item => {return item.name.toLowerCase().includes(this.filteredData.toLowerCase())}
    );
    }
}




