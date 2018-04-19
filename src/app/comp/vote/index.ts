import {CommonModule} from "@angular/common";
import {Popover} from "./Popover";
import {PopoverContent} from "./PopoverContent";
import {VoteHandler} from "./HandleVote";
import {NgModule} from "@angular/core";

export * from "./Popover";
export * from "./PopoverContent";
export * from "./HandleVote";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        PopoverContent,
        Popover
    ],
    exports: [
        PopoverContent,
        Popover
    ],
    providers: [ VoteHandler, Popover ],
    entryComponents: [
        PopoverContent
    ]
})
export class PopoverModule {

}