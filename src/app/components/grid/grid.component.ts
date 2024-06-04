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
    
  

  private _removeDuplicates(data: any[]): any[] {
    const uniqueEmployees = new Set();
    return data.filter(item => {
      const identifier = `${item.name}`;
      if (uniqueEmployees.has(identifier)) {
        return false;
      } else {
        uniqueEmployees.add(identifier);
        return true;
      }
    });
  }

  removeDuplicates() {
    const currentData = this.data.sourceCollection.slice();
    const uniqueData = this._removeDuplicates(currentData);
    this.data.sourceCollection = uniqueData;
  }

  filterData(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    if (!searchTerm) {
      this.data.sourceCollection = this.rawData;
    } else {
      const filteredData = this.rawData.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
      );
      this.data.sourceCollection = filteredData;
    }
  }
}
