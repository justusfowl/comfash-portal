
import { 
  Component, Input, OnInit, OnDestroy, 
  ViewChild, ViewContainerRef, 
  ComponentFactoryResolver, ComponentRef
} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'activity-content',
  template: `
      <div  class="activity-item">
          <div #container ></div>
      </div>
  `, 
  styleUrls: ['./activities.component.scss']
})
export class DynamicActivityComponent implements OnInit, OnDestroy {

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @Input()
  type: string;

  @Input()
  context: any;
  
  @Input()
  index: any;

  private mappings = {
      'comment': ActivityComponentComment,
      'follows': ActivityComponentFollows
  };

  private componentRef: ComponentRef<{}>;

  constructor(
      private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponentType(typeName: string) {
      let type = this.mappings[typeName];
      return type || UnknownDynamicComponent;
  }

  ngOnInit() {
      if (this.type) {
          let componentType = this.getComponentType(this.type);
          
          // note: componentType must be declared within module.entryComponents
          let factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
          this.componentRef = this.container.createComponent(factory);

          // set component context
          let instance = <DynamicComponent> this.componentRef.instance;
          instance.context = this.context;
          instance.index = this.index;
      }
  }

  ngOnDestroy() {
      if (this.componentRef) {
          this.componentRef.destroy();
          this.componentRef = null;
      }
  }



}

export abstract class DynamicComponent {
  context: any;
  index : any;
}

@Component({
  selector: 'activity-comment',
  templateUrl: './comment.activity.html', 
  styleUrls : ['./activities.component.scss', './follows.activity.scss']
})
export class ActivityComponentComment extends DynamicComponent {


  constructor(
    private router: Router) {
    super();
}

  goImgCollection(collection) {
    this.router.navigate(['imgCollection']); 
  }

  voteHandler(value){
    console.log(value);
  }
  
}

@Component({
  selector: 'dynamic-sample-2',
  templateUrl: './follows.activity.html', 
  styleUrls : ['./activities.component.scss', './follows.activity.scss']
})
export class ActivityComponentFollows extends DynamicComponent {}

@Component({
  selector: 'unknown-component',
  template: `<div>Unknown component ({{context?.text}})</div>`, 
  styleUrls : ['./activities.component.scss']
})
export class UnknownDynamicComponent extends DynamicComponent {}

