import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  answerText:string = "";
  Id: any;
  questionObj:any;

  constructor(public questionService: QuestionService, public userService: UserService, private route:ActivatedRoute, private router :Router) { }

  ngOnInit(): void {
    this.Id = this.route.snapshot.paramMap.get('questionId');
    this.questionService.getQuestionWithId(this.Id).subscribe((res)=> {
      this.questionObj = res
    })
  }

  postAnswer(){
    let answerObj = {
      userName: this.userService.user.userName,
      answer: this.answerText,
      plus:[],
      minus:[]
    }
    this.questionObj.answers.push(answerObj)

    this.questionService.updateQuestion(this.questionObj).subscribe((res)=> {
      console.log(res);
      this.answerText='';
    })
  }

  returnBack(){
    this.router.navigateByUrl('/home')
  }

  vote(index:number,point:number)
  {
    if(point == 1)
    {

      if(!(this.questionObj.answers[index].plus.indexOf(this.userService.user.id)>=0))
      {
        this.questionObj.answers[index].plus.push(this.userService.user.id);
      }

      // for (let i = 0; i < this.questionObj.solutions[index].minus.length; i++) {
      //  if(this.questionObj.solutions[index].minus[i] == this.userService.user.id)
      //  {
      //    this.questionObj.solutions[index].minus.splice(i,1);
      //  }
      // }

      this.questionObj.answers[index].minus = this.questionObj.answers[index].minus.filter((item: any)=> {
        item != this.userService.user.id
      })

    }
    else
    {
      if(!(this.questionObj.answers[index].minus.indexOf(this.userService.user.id)>=0))
      {
        console.log("asdas")

        this.questionObj.answers[index].minus.push(this.userService.user.id);
      }

      // for(let i = 0; i < this.questionObj.solutions[index].plus.length; i++){
      //   if(this.questionObj.solutions[index].plus[i] == this.userService.user.id){
      //     this.questionObj.solutions[index].plus.splice(i, 1);
      //   }
      // }

      this.questionObj.answers[index].plus= this.questionObj.answers[index].plus.filter((item: any)=> {
        item != this.userService.user.id
      })
    }

    this.questionService.updateQuestion(this.questionObj).subscribe((res)=>{
      this.answerText="";
    })
  }

}
