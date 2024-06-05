import { Component, OnInit } from '@angular/core';
import { CollectionView } from '@mescius/wijmo';
import { EmployeeServiceService } from '../../services/employee-service.service';
import '@mescius/wijmo.styles/wijmo.css';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  rawData: any[] = [];
  data: CollectionView;
  searchTerm : string ='';

  constructor(private employeeService: EmployeeServiceService) { 
    this.data = new CollectionView<any>([],{
      refreshOnEdit:false
    });
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((employees: any[]) => {
      this.rawData = employees;
      this.data = new CollectionView<any>(this.rawData, {
      refreshOnEdit: false
        
      });
     
    }); console.log('Sucessfully fetched employees');
    
  }
  removeDuplicates(){
    this.employeeService.removeDuplicates(this.searchTerm).subscribe(()=>{
      console.log("Sucessfully removed Duplicates")
      this.employeeService.getEmployees().subscribe((employees:any[])=>{
        this.rawData = employees;
        this.data.sourceCollection = this.rawData;
       
      });
      
    });
  }
  

  

  filterData(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;

    if (!this.searchTerm) {
      this.data.sourceCollection = this.rawData;
    } else {
      this.employeeService.searchEmployee(this.searchTerm).subscribe((filteredData :any []) => {
        this.data.sourceCollection = filteredData; 
      });
    }
}



}
