import { Component, ViewChild, ElementRef } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse, ConfigService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { OrgManagementService } from '../../services';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

/**
 * This component helps to upload bulk organizations data (csv file)
 *
 * This component also creates a unique process id on success upload of csv file
 */
@Component({
  selector: 'app-organization',
  templateUrl: './organization-upload.component.html',
  styleUrls: ['./organization-upload.component.css']
})
export class OrganizationUploadComponent {
  @ViewChild('inputbtn') inputbtn: ElementRef;
  /**
 * To show/hide loader
 */
  showLoader = false;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
 * To call org-management service which helps to upload bulk data
 */
  public orgManagementService: OrgManagementService;
  /**
 * reference of config service.
 */
  public config: ConfigService;
  /**
  * Contains unique process id
  */
  processId: string;
  /**
  * Contains uploaded fileName
  */
  fileName: string;
  /**
   * To show toaster(error, success etc) after any API calls
   */
  private toasterService: ToasterService;
  /**
    * Contains sample organization csv format
    */
  sampleOrgCSV: Array<Object>;

  constructor(orgManagementService: OrgManagementService, toasterService: ToasterService, private router: Router,
    config: ConfigService, resourceService: ResourceService) {
    this.orgManagementService = orgManagementService;
    this.resourceService = resourceService;
    this.config = config;
    this.toasterService = toasterService;
  }
  /**
 * This method helps to redirect to the parent component
 * page, i.e, bulk upload page
 */
  public redirect() {
    this.fileName = '';
    this.processId = '';
    this.router.navigate(['/bulkUpload']);
  }
  /**
* This method helps to download a sample csv file
*/
  public downloadSample() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true
    };
    const csv = new Angular2Csv(this.config.pageConfig.ADMIN_UPLOAD.SAMPLE_ORGANIZATION_CSV, 'Sample_Organizations', options);
  }
  /**
 * This method helps to call uploadOrg method to upload a csv file
 */
  openImageBrowser(inputbtn) {
    inputbtn.click();
  }
  /**
 * This method helps to upload a csv file and return process id
 */
  uploadOrg(file) {
    if (file[0] && file[0].name.match(/.(csv)$/i)) {
      this.showLoader = true;
      const formData = new FormData();
      formData.append('org', file[0]);
      const fd = formData;
      this.orgManagementService.bulkOrgUpload(fd).subscribe(
        (apiResponse: ServerResponse) => {
          this.showLoader = false;
          this.processId = apiResponse.result.processId;
          this.toasterService.success(this.resourceService.messages.smsg.m0031);
          this.fileName = file[0].name;
        },
        err => {
          this.showLoader = false;
          this.toasterService.error(err.error.params.errmsg);
        });
    } else if (file[0] && !(file[0].name.match(/.(csv)$/i))) {
      this.showLoader = false;
      this.toasterService.error(this.resourceService.messages.stmsg.m0080);
    }
  }
}
