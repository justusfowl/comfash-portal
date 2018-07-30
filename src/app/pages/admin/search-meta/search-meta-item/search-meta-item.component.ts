import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export class MyColor {
    constructor(public name: string) { }
  }

@Component({
    moduleId: module.id,
    selector: 'search-meta-item',
    templateUrl: 'search-meta-item.component.html',
    styleUrls: ['../search-meta.component.scss']
})
export class SearchMetaItemComponent implements OnInit {
    // we will pass in address from App component
    @Input('group')
    public adressForm: FormGroup;

    @Input('metaData')
    public metaData: any;

    @Input('attrTypeOptions')
    public attrTypeOptions : any = [];

    boolIsSex = false;

    metaDataLabels = []; 

    metaDataColors   = [];
    metaDataFabric   = [];
    metaDataTexture   = [];

    myControl = new FormControl();

    filteredAttrTypeOptions : Observable<any[]>;
  
    filteredOptionsColor: Observable<any[]>;

    filteredOptionsTexture: Observable<any[]>;
    filteredOptionsFabric : Observable<any[]>;

    filteredOptionsLabel: Observable<any[]>;
  
    ngOnInit() {
        if (this.metaData){
            this.selectLabelsForType();
            this.metaDataColors = this.metaData.color;

            this.metaDataFabric = this.getMetaDataPerCategory("fabric");
            this.metaDataTexture = this.getMetaDataPerCategory("texture");

            this.subscribeOptionsLabels();
    
            // listen for changes in a field for color
            this.filteredOptionsColor = this.adressForm.controls.attr_color.valueChanges
            .pipe(
              startWith<string | any>(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this.filterColor(name) : this.metaDataColors.slice())
            );

            this.filteredOptionsTexture = this.adressForm.controls.attr_texture.valueChanges
            .pipe(
              startWith<string | any>(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this.filterTexture(name) : this.metaDataTexture.slice())
            );

            this.filteredOptionsFabric = this.adressForm.controls.attr_fabric.valueChanges
            .pipe(
              startWith<string | any>(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this.filterFabric(name) : this.metaDataFabric.slice())
            );
            
            
            this.filteredAttrTypeOptions = this.attrTypeOptions
            /*this.adressForm.controls.attr_type.valueChanges
            .pipe(
              startWith<string | any>(''),
              map(value => {
                  console.log(value)
                  typeof value === 'string' ? value : value.name
                }),
              map(name => name ? this.filterAttrType(name) : this.attrTypeOptions.slice())
            );
            */
            

            this.adressForm.controls.attr_type.valueChanges.subscribe(value => {
                this.selectLabelsForType(value);

                if (value == "sex"){
                    this.adressForm.controls.sex.setValue("");
                    this.boolIsSex = true;
                }else{
                    this.adressForm.controls.attr_category.setValue("");
                    this.boolIsSex = false;
                }
                
            })
        }
    }

    getMetaDataPerCategory(category){

        let index = this.metaData.meta.findIndex(x => x["label"] === category);

        if (index != -1){
            return this.metaData.meta[index].children
        }
    }


    subscribeOptionsLabels(){
        if (this.metaDataLabels.length > 0){
            if (!this.boolIsSex){
                this.filteredOptionsLabel = this.adressForm.controls.attr_category.valueChanges
                .pipe(
                  startWith<string | any>(''),
                  map(value => typeof value === 'string' ? value : value.name),
                  map(name => name ? this.filterLabel(name) : this.metaDataLabels.slice())
                )
            }else{
                this.filteredOptionsLabel = this.adressForm.controls.sex.valueChanges
                .pipe(
                  startWith<string | any>(''),
                  map(value => typeof value === 'string' ? value : value.name),
                  map(name => name ? this.filterLabel(name) : this.metaDataLabels.slice())
                )
            }

        }
    }

    getLabelItems(values, key, isTopLevel, ref) {

        for (var i=0;i<values.length;i++){
        
            let v = values[i];
            
            if (v.attr_type == key && !v.children) {
                ref.metaDataLabels.push(v)
                
            }
            if (v.children) {
                ref.getLabelItems(v.children, key, false, ref);
            }
        
        }
    
        if (isTopLevel){
        
            console.log("done")
        
        }
            
    }

    selectLabelsForType(type?){
        try{
            let attr_type = this.adressForm.controls.attr_type.value || type;
           // this.metaDataLabels = this.metaData[attr_type];

            this.metaDataLabels.length = 0;

            this.getLabelItems(this.metaData.meta, attr_type, true, this)
    
            this.subscribeOptionsLabels();
        }catch(err){
            console.log(err)
        }
        
    }

    displayProb(value){
        return Math.round(value*10000)/100 + "%";
    }
  
    filterColor(name: any): any[] {
      return this.metaDataColors.filter(color =>
        color.name.toLowerCase().indexOf(name.toLowerCase()) != -1);
    }

    filterFabric(name: any): any[] {
        return this.metaDataFabric.filter(label =>
            label.label.toLowerCase().indexOf(name.toLowerCase()) != -1);
    }

    filterTexture(name: any): any[] {
        return this.metaDataTexture.filter(label =>
            label.label.toLowerCase().indexOf(name.toLowerCase()) != -1);
    }

    filterLabel(name: any): any[] {
        return this.metaDataLabels.filter(label =>
            label.label.toLowerCase().indexOf(name.toLowerCase()) != -1);
    }

    filterAttrType(name: any): any[] {
        return this.attrTypeOptions.filter(type =>
            type.name.toLowerCase().indexOf(name.toLowerCase()) != -1);
    }
  
    displayFn(option): string {
      return option;
    }


}