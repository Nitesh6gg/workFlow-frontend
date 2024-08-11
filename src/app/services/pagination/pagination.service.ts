import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

    // Default pagination settings
    currentPage: number = 0;
    size: number = 5;
    sort: string = 'createdON,Desc';

    NoOfElements: number = 0;
    totalElements:number=0;
    totalPages:number=0;
    
  constructor() { }

  // Update pagination details from API response
  updatePagination(data: any): void {
    this.currentPage = data.number; // 0-based page index
    this.size = data.size;
    this.NoOfElements = data.numberOfElements;
    this.totalElements = data.totalElements;
    this.totalPages = data.totalPages;
  }

  // Get parameters for API call
  getPaginationParams() {
    return {
      page: this.currentPage,
      size: this.size,
      sort: this.sort,
    };
  }

  get startIndex() {
    return this.currentPage * this.size + 1;
  }

  get endIndex() {
    return Math.min((this.currentPage + 1) * this.size, this.totalElements);
  }

  setCurrentPage(page: number): void {
    if (page < 0) {
      this.currentPage = 0;
    } else if (page >= this.totalPages) {
      this.currentPage = this.totalPages - 1;
    } else {
      this.currentPage = page;
    }
  }

  
  nextPage(loadDataFn: () => void): void {
    if (this.currentPage < this.totalPages - 1) {
      this.setCurrentPage(this.currentPage + 1);
      loadDataFn(); // Execute the data loading function
    }
  }

  prevPage(loadDataFn: () => void): void {
    if (this.currentPage > 0) {
      this.setCurrentPage(this.currentPage - 1);
      loadDataFn(); // Execute the data loading function
    }
  }

  getPageRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // Go to a specific page
  goToPage(page: number, loadDataFn: () => void): void {
    this.setCurrentPage(page);
    loadDataFn();
  }

  changePageSize(event: any, loadDataFn: () => void): void {
    this.size = parseInt(event.target.value);
    this.currentPage = 0; // Reset to first page
    loadDataFn(); // Execute the data loading function
  }

  sortByField(field: string, loadDataFn: () => void): void {
    this.sort = field;
    this.currentPage = 0; // Reset to first page
    loadDataFn(); // Execute the data loading function
  }





}
