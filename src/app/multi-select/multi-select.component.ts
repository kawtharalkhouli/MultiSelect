import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
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
  <form [formGroup]="cityValue" #formDiv>
  <div class="body" #body >
      <div class="select-menu" #selectMenu >
          <div class="select-btn" #select  (click)="toggleMenu()" [ngClass]="{'select-clicked':isClicked === true}">
              <span class="select-btn-text" #selectText [innerText]="selectedCity"></span>
              <div class="arrow" #arrow  [ngClass]="{'arrow-rotate':isClicked === true}"></div>
          </div>
          <ul class="options"  #options [ngClass]="{'menu-open':isClicked === true, 'menu-closed':isClicked === false}" >
              <div class="search-options" #searchOptions>
                  <input type="checkbox" class="checkbox" #checkAll [(ngModel)]="isMasterSel" [ngModelOptions]="{standalone: true}" (change)="checkUncheckAll()">
                  <input type="text" class="search-box"  #searchText   [(ngModel)]="filteredData" [ngModelOptions]="{standalone: true}" (keyup) ="filterCities()">
                  <span><i #close class="fa fa-times"  (click)="toggleMenu()" [ngClass]="{'menu-open':isClicked === true}" ></i></span>
              </div>
               <li class="option" #option  *ngFor="let city of filterdData" [value]="city" formControlName="cityName" ngDefaultControl>
              <label class="optionText" #optionText>
                  <input type="checkbox" class="checkbox" #selctCheckbox (change)="isAllSelected()" [(ngModel)]="city.isSelected" [ngModelOptions]="{standalone: true}">
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
  selectStyle=[{
    "background":"#333",
    "color":"#fff"
  }];

  @Input() customStyle: any[]=[];

  customStyle22 = [
    {
      selectStle: [{
        "background":"#333",
        "color":"#fff"
      }]
    }
  ]
  @Input() data:any =[];
  @Input() configurations:any;
  //@Input() customStyle:any;
  @ViewChild('formDiv') formDiv: ElementRef;
  @ViewChild('body') body: ElementRef;
  @ViewChild('selectMenu') selectMenu: ElementRef;
  @ViewChild('select') select: ElementRef;
  @ViewChild('selectText') selectText: ElementRef;
  @ViewChild('arrow') arrow: ElementRef;
  @ViewChild('options') options: ElementRef;
  @ViewChild('checkAll') checkAll: ElementRef;
  @ViewChild('searchText') searchText: ElementRef;
  @ViewChild('close') close: ElementRef;
  //@ViewChild('option') option: ElementRef;
  @ViewChild('optionText') optionText: ElementRef;
  @ViewChild('selectCheckbox') selectCheckbox: ElementRef;
  @ViewChild('images') images: ElementRef;
  @ViewChild('searchOptions') searchOptions: ElementRef;
  @ViewChildren(ElementRef) elements: QueryList<any>;
  @ViewChildren('option') optionElements: QueryList<ElementRef>;

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

    for (const style of this.customStyle) {
      console.log(style);
      
    }
      
    this.selectStyle.forEach((style)=>{
      for(let key in style){
        this.renderer.setStyle(this.select.nativeElement, key , style[key],1);
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




