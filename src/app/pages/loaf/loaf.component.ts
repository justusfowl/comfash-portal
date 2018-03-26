import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-loaf',
  templateUrl: './loaf.component.html',
  styleUrls: ['./loaf.component.scss',
               '../../app.component.scss']
})
export class LoafComponent implements OnInit {

  public sessionResponses = [
    {
      "imgPath" : "../../assets/img/6.jpg", 
      "dateDay" : "07", 
      "dateMonth" : "mar", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }, 
      "tagged" : true
    },
    {
      "imgPath" : "../../assets/img/8.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 91, 
      "comments" : 2, 
      "voteStats" : {
        "avg" : 45
      }, 
      "tagged" : false
    },
    {
      "imgPath" : "../../assets/img/9.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : "5k", 
      "comments" : "120k", 
      "voteStats" : {
        "avg" : 81
      }, 
      "tagged" : false
    },
    {
      "imgPath" : "../../assets/img/10.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 931, 
      "comments" : 231, 
      "voteStats" : {
        "avg" : 71
      }, 
      "tagged" : false
    },
    {
      "imgPath" : "../../assets/img/3.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 87, 
      "comments" : 6, 
      "voteStats" : {
        "avg" : 98
      }, 
      "tagged" : false
    }
  ]


  public occasions = [
    "All",
    "Wedding", 
    "Evening", 
    "Office", 
    "Casual", 
    "Sports", 
    "Date"
  ]


  public colors = [

    "#000000",
    "#2f4f4f",
    "#696969",
    "#708090",
    "#8b8989",
    "#f0fff0",
    "#c1cdc1",
    "#e6e6fa",
    "#4682b4",
    "#5f9ea0",
    "#f0e68c",
    "#eedd82",
    "#8b4513",
    "#c71585",
    "#9370db",
    "#d8bfd8"

  ]

  public brands = [

    "Chanel", 
    "Gucci", 
    "Armani", 
    "Asprey", 
    "Nigel Blum", 
    "Chloe", 
    "Cerruti"

  ]


  filterSexMale = true;
  filterSexFemale = true;
  filterHasPurchaseTags = false;

  filterBrands = new FormControl();

  toppings = new FormControl();

  toppingList = ['Jacket', 'Blouse', 'Pants', 'Dress', 'Suit', 'Sportswear'];



  constructor() { }
 
  ngOnInit() {
  }

}
