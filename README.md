# Inventory Management Service
재고 관리 서비스 프로젝트입니다.
* name : NiceInventory
* demo video : [LINK](https://indeeah.tistory.com/46)
* code info : [LINK](https://indeeah.tistory.com/47)

| version | date |
|:---------:|:------:|
| 1.0.0 | 2023-01-31 |

---
## 서비스 소개
간단한 인터페이스로 재고 관리를 할 수 있다.

사용자가 원하는 제품 카테고리를 추가 할 수 있으며, 각 재고들은 회사별로 관리된다.

1. 회원가입, 로그인, 회원조회, 비밀번호변경 **User CRUD**
2. 비밀번호 저장시 **AES-256-ABC**로 암호화 하여 저장
3. 로그인시 **jwt**를 이용하여 로그인 정보 기억
4. 사용자의 저장된 회사별로 제품 재고 검색, 추가, 수정 **Product CRUD**
5. 사용자의 저장된 회사별로 제품 카테고리 검색, 추가 **Product category CRUD**

## 기술 스택
### Frontend
* Bootstrap
* Vanilla javascript
* html
* css
### Backend
* Node.js
* Express.js
* MySQL
* cors

## 폴더 구조
### Frontend
* `src/views/i-${pageName}.html` : 화면
* `src/views/js/`
    * `api.js` : api 호출
    * `base.js` : 공통으로 쓰이는 함수
    * `${pageName}.js` : 화면별 함수
### Backend
* `src/controlers/` : Controler
    * `${pathName1}/`
        * `${pathName1}Handler.js`
        * `function/${pathName1}.${pathName2}.js`
* `src/lib/`
    * `base.js` : 공통으로 쓰이는 함수
    * `crypto.js` : 암호화
    * `errCode.js` : 에러 코드
    * `db.js`, `rds.db.js`, `rds.query.js` : Model
* `src/middlewares/`
    * `eventForm.js` : request를 event form으로 convert
    * `userToken.js` : jwt
* `src/routers` : router
