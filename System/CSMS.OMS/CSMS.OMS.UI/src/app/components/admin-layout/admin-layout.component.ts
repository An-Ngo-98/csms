import { Component } from '@angular/core';
import { RoleConstant } from '../../commons/consts/permission.const';
import { RoleService } from '../../services/system/role.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {

  constructor(private roleService: RoleService) { }

  public isShowSideBar(): boolean {
    return this.roleService.hasPermission(RoleConstant.ADMIN);
  }
}
