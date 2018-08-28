import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-admin-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss',
  '../../../app.component.scss']
})
export class AdminAnalysisComponent implements OnInit {

  public columnChartData:any =  {
    chartType: 'ColumnChart',
    dataTable: [
      ['Label', 'Count', { role: 'style' }]
    ],
    options: {
      title: 'Labels',
      'height':500, 
      'chartArea': {'width': '90%', 'height': '80%'},
      'legend': {'position': 'none'},
      animation:{
        duration: 100,
        startup: true
      },
      series: {
        legend: 'none'}
      }
  };

  private aggGroupLabelsInfoData;

  private labelCountLimit : number = 200;

  searchPhrase : any = ""; 

  constructor(
    private api: ApiService, 
    private notify : NotificationService
  ) {


  }

  ngOnInit() {

    this.getGroupLabelsInfo();

  }

  setGroupLabelsInfo(){

    this.columnChartData = Object.create(this.columnChartData);

    let data = this.aggGroupLabelsInfoData;

    let totalArray = [];

    totalArray.push(this.columnChartData.dataTable[0]);

    data.forEach(element => {
      let labelsLeft = this.labelCountLimit - parseInt(element.total);
      let color; 

      if (labelsLeft < 0){
        color = "#33434b";
      }else{
        color = "#d8a69e";
      }

      let item = [element.label, element.total,color]
      totalArray.push(item);
      
    });

    this.columnChartData.dataTable = totalArray;

  }

  getGroupLabelsInfo(){

    let options = {
      "isValidated" : true, 
      "sortby" : "total", 
      "sort" : -1
    };

    this.api.getGroupLabelsInfo(options).subscribe(
        (data : any) => {
            
            try{
              this.aggGroupLabelsInfoData = data;
              this.setGroupLabelsInfo();

            }
            catch(err){
                console.log(err);
            } 

        },
        error => {
            this.api.handleAPIError(error);
        }
        )
  }

  issueCrawlRequest(){

    this.api.issueCrawlRequest(this.searchPhrase).subscribe(
      (data : any) => {
          
          try{
            this.searchPhrase = ""; 
            this.notify.toastInfo("METASEARCH_CRAWL_ACCEPT", "", 5000);

          }
          catch(err){
              console.log(err);
          } 

      },
      error => {
          this.api.handleAPIError(error);
      }
      )
  }


}
