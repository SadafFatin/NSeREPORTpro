import { Facility } from './../interfaces/user-options';
import { FWLocalDraftData } from './../interfaces/fwlocalDB';
import { FWFinalData } from './../interfaces/fwfinal';
import { ApiClientService } from './../service/rest/api-interface.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { UserData } from '../providers/user-data';
import { StorageService } from '../service/stored-data/storage.service';
import { ActivatedRoute } from '@angular/router';
import { FWDraftData } from '../interfaces/fwdata';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements AfterViewInit {

  facilityList: Facility[];
  fwLocalDraftData: FWLocalDraftData[] = [];
  fwDraftData: FWDraftData[] = [];
  facilityWiseDraftData: FacilityDraftData[] = [];
  unSyncedFwLocalDraftData: FWLocalDraftData[] = [];
  segment: string = "local";

  localDataSyncedCount: number = 0;
  lastSynced:string;

  constructor(public userData: UserData,
    public storageService: StorageService,
    public route: ActivatedRoute,
    public apiClient: ApiClientService) {
  }


  async ngOnInit() {
    console.log('ngOnInit');
    const date = await this.userData.getSyncedDate();
    if(date){
      this.lastSynced = new Date(date).toDateString();
    }

    console.log('ngAfterViewInit');
    this.facilityList = this.storageService.facilities;

    for (let facility of this.facilityList) {
      this.fwLocalDraftData = this.fwLocalDraftData.concat(await this.userData.getDraftDataFromStorageByFacility(facility.id.toString()));
    }

    for (let facility of this.facilityList) {
      const value  = await this.apiClient.loadFWPrevDraftDataByFacility(facility.id);
      let draftData:FacilityDraftData = {
        facility_id: facility.id,
        facility_name: facility.name,
        fw_draft_data: []
      };
      if(value.success){
        draftData.fw_draft_data = value.data;
        this.facilityWiseDraftData.push(draftData);
      }
    }
    for (let fwLocalData of this.fwLocalDraftData) {
      if (fwLocalData.synced) {
        this.localDataSyncedCount++;
      }
      else{
        this.unSyncedFwLocalDraftData.push(fwLocalData);
      }
    }

  }

  async ngAfterViewInit() {

  }



  deleteDraftData(){

  }

  syncData(){

  }



}



export interface FacilityDraftData{
  "facility_id":number;
  "facility_name":string;
  "fw_draft_data": FWDraftData[];
}
