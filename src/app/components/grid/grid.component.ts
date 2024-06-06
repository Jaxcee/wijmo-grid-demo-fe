import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionView } from '@mescius/wijmo';
import { EmployeeServiceService } from '../../services/employee-service.service';
import { FlexGrid } from '@mescius/wijmo.grid';
import { FlexGridFilter } from '@mescius/wijmo.grid.filter';
import '@mescius/wijmo.styles/wijmo.css';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  rawData: any[] = [];
  data: CollectionView;
  searchTerm: string = '';

  @ViewChild('flex') flex!: FlexGrid;

  constructor(private employeeService: EmployeeServiceService) { 
    this.data = new CollectionView<any>([], {
      refreshOnEdit: false
    });
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((employees: any[]) => {
      this.rawData = employees;
      this.data.sourceCollection = this.rawData;
    });
  }

  // onSortIconClick(binding: string, orderType: string, event: MouseEvent) {
  //   event.stopPropagation(); // Prevent the default column header click event
  //   this.sortByBackend(binding, orderType);
  // }
  onSortIconClick(grid:FlexGrid,e:any){
    const sortInfo = grid.collectionView.sortDescriptions;

    if (sortInfo.length > 0) {
      const sortColumn = sortInfo[0].property;
      const sortDirection = sortInfo[0].ascending ? 'asc' : 'desc';
    
    this.sortByBackend(sortColumn, sortDirection);
    }
  }
  sortByBackend(column: string, orderType: string) {
    this.employeeService.sortEmployees(column, orderType).subscribe((sortedData: any[]) => {
      this.rawData = sortedData;
      this.data.sourceCollection = this.rawData;
      console.log(this.rawData)
    });
  }

  removeDuplicates() {
    this.employeeService.removeDuplicates(this.searchTerm).subscribe(() => {
      this.employeeService.getEmployees().subscribe((employees: any[]) => {
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
      this.employeeService.searchEmployee(this.searchTerm).subscribe((filteredData: any[]) => {
        this.data.sourceCollection = filteredData;
      });
    }
  }

  grid: any[] = [
    { header: "ID", binding: "empId" },
    { header: "Name", binding: "employeeName" },
    { header: "Department", binding: "departmentName" }
  ];
}
