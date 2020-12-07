import { animate, state, style, transition, trigger } from '@angular/animations';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GithubRepository } from '../model/github-repository';
import { GithubRepositoryService } from '../service/github-repository.service';
import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomePageComponent implements AfterViewInit  {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  githubRepositories : GithubRepository[];
  dataSource :MatTableDataSource<GithubRepository>;
  columnsToDisplay = ['name', 'forks_count', 'stargazers_count', 'url','expanded'];
  expandedElement: GithubRepository | null;
  resultsLength = 0;
  updating = false;
  config = new MatSnackBarConfig();



  languageFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(private service: GithubRepositoryService,private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(this.githubRepositories);
    this.setConfig();
  }
  setConfig(){
    let horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';
    let autoHide: number = 2000;
    this.config.verticalPosition = verticalPosition;
    this.config.horizontalPosition = horizontalPosition
    this.config.duration = autoHide;
    this.config.panelClass = ['snackBar'] ;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  clearTable() {
    this.dataSource.data = [];
  }
  
  findAll(){  
    if (this.languageFormControl.valid) {
      this.updating = true;
      let language = this.languageFormControl.value;
      this.service.getGithubRepositories(language)
        .subscribe(githubRepositories => {
          this.githubRepositories = githubRepositories;
        
          if(  this.githubRepositories){
            this.dataSource.data =  this.githubRepositories;
            this.resultsLength = this.githubRepositories.length;
          }else{
            this.clearTable();
            this.resultsLength = 0;
            this.snackBar.open( "Não possui nenhum reposítório salvo com essa linguagem.", "x", this.config);
          }
          this.updating = false;
        },  error => {
          this.snackBar.open( "Erro ao buscar os repositórios.", "x", this.config);
          this.updating = false
          return;
        }
      );
    }else{
      this.snackBar.open( "O nome da linguagem é obrigatório.", "x", this.config);
    }
  }
  
  synchronize(){
    if (this.languageFormControl.valid) {
      this.updating = true;
      let language = this.languageFormControl.value;
      this.service.refresh(language).subscribe(x =>{ 
        this.findAll();
        this.updating = false
        this.snackBar.open( "Sucesso ao importar os dados.", "x", this.config);
      }, error => {
        if(error.status == "403"){
          this.snackBar.open( "Atingiu o número máximo de requisições para a APi Dp Git por hora.", "x", this.config);
        }

        this.updating = false
        return;
      }
  );
    }
    else{
      this.snackBar.open( "O nome da linguagem é obrigatório.", "x", this.config);
    }
  }
}
