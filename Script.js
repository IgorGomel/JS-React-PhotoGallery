const CLIENT_ID = "NcMjHTa__4twlLaP28avVF_ki52TgJiv0-y9-1iZvXQ";
const amountPhoto = 10;

class Main extends React.Component{
  constructor(props) {
		super(props); 
	}

  closeModalWindow() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }

  render() {
    return (
      <div className="main-container">
            <Head />
            <Content />            
            <div id="myModal" className="modal">
              <span className="close" onClick={this.closeModalWindow}>&times;</span>
              <img className="modal-content" id="img01" />
              <p className="modal-content-TextAuthor" id="modal-content-TextAuthor-Id"></p>
              <div id="caption"></div>
            </div>
      </div>
    );
  }
}

class Head extends React.Component{
  render() {
    return (
      <div className="head"><p className="headText">ФОТОГАЛЕРЕЯ</p></div>
    );
  }
}

class Content extends React.Component{
  constructor(props) {
		super(props);
    this.state = {
      photoParameters: {},
      photos: [],
      photosIsLoaded: false,
      slug: '',
      error: null
    }; 
  }

  updatePhoto = (value) => {
    this.setState({ photoParameters: value });
  }

  updateListPhotosMiniByCategory = (slugValue) => {
    const url = `https://api.unsplash.com/photos/random?client_id=${CLIENT_ID}&count=${amountPhoto}&query=${slugValue}`;
    const response = fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            photosIsLoaded: true,
            photos: result,
            slug: slugValue
          });
        },
        (error) => {
          this.setState({
            photosIsLoaded: true,
            error
          });
        }
      )
  }

  render() {
    return (
      <div className="content">
            <Categories updateListPhotosMiniByCategory={this.updateListPhotosMiniByCategory} />
            <ListPhotosMini updatePhoto={this.updatePhoto} photos={this.state.photos} 
                              photosIsLoaded={this.state.photosIsLoaded} error={this.state.error}
                              updateListPhotosMiniByCategory={this.updateListPhotosMiniByCategory} 
                                                                              slug={this.state.slug}/>
            <ViewPhoto photoParameters={this.state.photoParameters} />
      </div>
    );
  }
}

class Categories extends React.Component{  
  constructor(props) {
		super(props);
    this.state = { 
        error: null,
        categoriesIsLoaded: false,
        listCategoryItems: []
    }; 
	}
  
  componentDidMount() {
    const url = `https://api.unsplash.com/topics?client_id=${CLIENT_ID}&per_page=${19}`;
    const response = fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          
          let listCategoryItems = [];        
          let arrCategoryObjects = result.map(item => {
             let obj = {};
             obj.slug = item["slug"];
             obj.title = item["title"];
             return obj; 
          });
          for(let i=0; i < arrCategoryObjects.length; i++) {
            listCategoryItems.push(<Category key={i.toString()} 
                                      slug={arrCategoryObjects[i].slug} title={arrCategoryObjects[i].title} 
                                        updateListPhotosMiniByCategory={this.props.updateListPhotosMiniByCategory} />);
          }

          this.setState({
            categoriesIsLoaded: true,
            listCategoryItems
          });

          this.props.updateListPhotosMiniByCategory(arrCategoryObjects[0].slug); // грузим фотки 1-ї категорії в списку
        },
        (error) => {
          this.setState({            
            categoriesIsLoaded: true,
            error
          });
        }      
      )
    console.log("Finish Categories");  
  }
  
  render() {
    const { error, categoriesIsLoaded } = this.state;
    if (error) {
      return <div className="categories">Помилка: {error.message}</div>;
    } else if (!categoriesIsLoaded) {
      return <div className="categories">Завантаження...</div>;
    } else {
        return (
          <div className="categories">{this.state.listCategoryItems}</div>
        );
      }
  }
}

class Category extends React.Component{
  constructor(props) {
		super(props);
    this.handleClick = this.handleClick.bind(this); 
	}

  handleClick(e) {
    this.props.updateListPhotosMiniByCategory(e._targetInst._currentElement.props.slug);
  }
  
  render() {
    return (       
      <div> 
        <div className="categoryItem" onClick={this.handleClick} slug={this.props.slug}>
          {this.props.title}
        </div>
      </div>
    );
  }
}

class ListPhotosMini extends React.Component{
  constructor(props) {
		super(props);
    this.updatePhotos = this.updatePhotos.bind(this); 
	}

  updatePhotos() {
    this.props.updateListPhotosMiniByCategory(this.props.slug);
  }

  render() {
    const { error, photosIsLoaded, photos } = this.props;
    
    if (error) {
      return <div className="listPhotosMini">Помилка: {error.message}</div>;
    } else if (!photosIsLoaded) {
      return <div className="listPhotosMini">Завантаження...</div>;
    } else {
      let listPhotoItems = [];
      let photoParameters = {};
      for(let i=0; i < amountPhoto; i++) {
        photoParameters.url = photos[i].urls.regular;
        photoParameters.name = photos[i].user.name;
        photoParameters.description = photos[i].alt_description; 
        listPhotoItems.push(<PhotoMini key={i.toString()} 
                                  photoParameters={photoParameters} updatePhoto={this.props.updatePhoto} />);
        photoParameters = {}
      }   

      return (
        <div className="listPhotosMini">
          <div className="listPhotosMiniContent">
            {listPhotoItems}
          </div>
          <button className="btnUpdatePhotos" onClick={this.updatePhotos}>Оновити</button>        
        </div>      
      );
    }  
  }
  
}

class PhotoMini extends React.Component{
  constructor(props) {
		super(props);
    this.handleClick = this.handleClick.bind(this); 
	}

  handleClick(e) {
    this.props.updatePhoto(this.props.photoParameters);
  }
  
  render() {
    return ( 
      <div> 
        <img className="photoMini" onClick={this.handleClick} src={this.props.photoParameters.url} />
      </div>
    );
  }
}

class ViewPhoto extends React.Component{
  constructor(props) {
		super(props);
    this.showModalWindow = this.showModalWindow.bind(this); 
	}

  showModalWindow() {
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("img01");
    var modalContentTextAuthorId = document.getElementById('modal-content-TextAuthor-Id');
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = this.props.photoParameters.url
    modalContentTextAuthorId.innerText = "Author: " + this.props.photoParameters.name;
    captionText.innerHTML = this.props.photoParameters.description;
  }

  render() {
    return (      
        <div className="viewPhoto">     
          <img className="viewPhotoImg" src={this.props.photoParameters.url} onClick={this.showModalWindow} />
          <p className="viewPhotoTextAuthor">Author: {this.props.photoParameters.name}</p>
          <div className="viewPhotoDescription">{this.props.photoParameters.description}</div>
        </div>       
    );
  }
}

const root = document.getElementById('root');
ReactDOM.render(<Main />, root);