import axios from 'axios'
import React from 'react';
import Dropzone from 'react-dropzone';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';


import config from '../../../config';
import CreateRecipeValidator from './validation/createRecipeValidator';

import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import RecipeCard from '../../components/RecipeCard';

import bannerImage1 from '../../../../assets/img/banner-1.jpg';


const dropZoneStyles = {
  border: 'none',
  cursor: 'pointer'
};

export default class CreateRecipe extends React.Component {
  constructor(props) {
    super(props);

    this.miniError = {
      color: '#E27C3E',
      fontWeight: '700'
    };
    this.state = {
      title: '',
      description: '',
      image: null,
      timeToCook: '',
      ingredients: [''],
      imageUrl: null,
      procedure: ['Mix the fufu with ...'],
      loading: false,
      ajaxErrors: [],
      errors: {
        title: [],
        description: [],
        timeToCook: [],
        ingredients: [],
        procedure: [],
        image: []
      },
      editing: false
    };

    // Method bindings 
    this.handleDrop = this.handleDrop.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.removeProcedure = this.removeProcedure.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this); 
    this.addNewIngredient = this.addNewIngredient.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewProcedureStep = this.addNewProcedureStep.bind(this);  
    this.handleProcedureChange = this.handleProcedureChange.bind(this);
    this.handleIngredientChange = this.handleIngredientChange.bind(this);
    this.uploadImagetoCloudinary = this.uploadImagetoCloudinary.bind(this);    
  }
  /**
   * Handle a new file upload event
   * 
   * @param {any} file The uploaded file instance
   * @memberof CreateRecipe
   */
  handleDrop(file) {
    this.setState({ image: file[0], imageUrl: null });
  }

  /**
   * Handle the recipe update process
   * 
   * @memberof CreateRecipe
   */
  async handleUpdate() {
    const validator = new CreateRecipeValidator(this.state);
    if (!validator.isValid()) {
      const errors = { ...this.state.errors };

      this.setState({ errors });
      return;
    }

    try {
      this.setState({ loading: true });

      let imageUrl;
      if (this.state.image) {
        imageUrl = await this.uploadImagetoCloudinary();      
      } else {
        imageUrl = this.state.imageUrl;
      }

      await this.props.updateRecipe({
        title: this.state.title,
        timeToCook: this.state.timeToCook,
        description: this.state.description,
        ingredients: JSON.stringify(this.state.ingredients),
        procedure: JSON.stringify(this.state.procedure),
        imageUrl: imageUrl
      }, this.props.params.id);
      this.setState({ loading: false });
      
      this.props.router.push(`/recipe/${this.props.params.id}`);    
    } catch (error) {}
  }
  /**
   * Handle image upload to cloudinary
   * 
   * @memberof CreateRecipe
   */
  async uploadImagetoCloudinary() {
    try {
      const imageUploadData = new FormData();
      imageUploadData.append('file', this.state.image);
      imageUploadData.append('tags', `recipe`);
      imageUploadData.append('upload_preset', config.cloudinaryUploadPreset);
      imageUploadData.append('api_key', config.cloudinaryApiKey);
      imageUploadData.append('timestamp', (Date.now() / 1000) | 0);
      
      //  Delete x-access-token for acceptance by cloudinary api
      delete axios.defaults.headers.common['x-access-token'];
  
      const cloudinaryResponse = await axios.post(config.cloudinaryImageUploadUrl, imageUploadData, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
  
      //  Configure header for subsequent axios calls
      axios.defaults.headers.common['x-access-token'] = this.props.authUser.access_token;

      return Promise.resolve(cloudinaryResponse.data.secure_url);
    } catch (errors) {
      return Promise.reject(errors);
    }
  }
  /**
   * Handle the recipe creation process
   * 
   * @returns 
   * @memberof CreateRecipe
   */
  async handleSubmit() {
    const validator = new CreateRecipeValidator(this.state);
    if (!validator.isValid()) {
      const errors = { ...this.state.errors };
      errors['image'] = validator.errors['image'];

      this.setState({ errors });
      return;
    }
    
    try { 
      this.setState({ loading: true });    

      const imageUploadData = new FormData();
      imageUploadData.append('file', this.state.image);
      imageUploadData.append('tags', `recipe`);
      imageUploadData.append('upload_preset', config.cloudinaryUploadPreset);
      imageUploadData.append('api_key', config.cloudinaryApiKey);
      imageUploadData.append('timestamp', (Date.now() / 1000) | 0);
      
      //  Delete x-access-token for acceptance by cloudinary api
      delete axios.defaults.headers.common['x-access-token'];

      const cloudinaryResponse = await axios.post(config.cloudinaryImageUploadUrl, imageUploadData, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });

      //  Configure header for subsequent axios calls
      axios.defaults.headers.common['x-access-token'] = this.props.authUser.access_token;

      const response = await this.props.createRecipe({
        title: this.state.title,
        timeToCook: this.state.timeToCook,
        description: this.state.description,
        ingredients: JSON.stringify(this.state.ingredients),
        procedure: JSON.stringify(this.state.procedure),
        imageUrl: cloudinaryResponse.data.secure_url
      });
    
      console.log(response);
    this.setState({ loading: false });
    
    this.props.router.push(`/recipe/${response.data.data.recipe.id}`);    
    } catch (error) {
      console.log(error);
      if (error.response.status === 422) {
        this.setState({
          ajaxErrors : error.response.data.data.errors
        });
      } else {
        this.setState({
          ajaxErrors : ['Something went wrong. Please refresh and try again later.']
        });
      }
    }
  }

  /**
   * Execute before component is mounted
   * 
   * @memberof CreateRecipe
   */
  componentWillMount() {
    if (this.props.params.id) {
      const recipe = this.props.recipes.find(recipe => recipe.id === this.props.params.id);

      this.setState({
        editing: true,
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        timeToCook: recipe.timeToCook,
        ingredients: JSON.parse(recipe.ingredients),
        procedure: JSON.parse(recipe.procedure),
      });
    }
  }
  

  /**
   * Handle input change events
   * 
   * @param {any} event change event
   * @memberof CreateRecipe
   */
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  /**
   * Validate form input fields
   * 
   * @param {any} event blur event object
   * @memberof CreateRecipe
   */
  validateInput(event) {
    const validator = new CreateRecipeValidator(this.state);

    if (!validator.isValid()) {
      const errors = { ...this.state.errors };
      errors[event.target.name] = validator.errors[event.target.name];

      this.setState({ errors });
      return false;
    } else {
      const errors = {
        title: [],
        description: [],
        timeToCook: [],
        ingredients: [],
        procedure: [],
        image: []
      }
      this.setState({ errors });
      return true;
    }
  }
  /**
   * Add a new ingredient input field
   * 
   * @memberof CreateRecipe
   */
  addNewIngredient() {
    const ingredients = this.state.ingredients;
    ingredients.push('');
    this.setState({ ingredients });
  }
  /**
   * Remove a procedure step from procedure
   * 
   * @param {any} index index of step
   * @returns 
   * @memberof CreateRecipe
   */
  removeProcedure(index) {
    const procedure = this.state.procedure;
    if (procedure.length <= 1) {
      return;
    }
    procedure.splice(index, 1);
    this.setState({ procedure });
  }

  /**
   * Remove an ingredient from state
   * 
   * @param {any} index index of ingredient in state
   * ingredients array
   * @returns 
   * @memberof CreateRecipe
   */
  removeIngredient(index) {
    const ingredients = this.state.ingredients;
    if (ingredients.length <= 1) {
      return;
    }
    ingredients.splice(index, 1);
    this.setState({ ingredients });
  }
  /**
   * Add a new procedure to procedures
   * 
   * @memberof CreateRecipe
   */
  addNewProcedureStep() {
    const procedure = this.state.procedure;
    procedure.push('');
    this.setState({ procedure });
  }
  /**
   * Handle a change in the ingredient input value
   * 
   * @param {any} event event
   * @param {any} index index of ingredient
   * @memberof CreateRecipe
   */
  handleIngredientChange(event, index) {
    const ingredients = this.state.ingredients;
    ingredients[index] = event.target.value;
    this.setState({ ingredients });
  }
  /**
   * 
   * 
   * @param {any} event event
   * @param {any} index index of procedure step
   * @memberof CreateRecipe
   */
  handleProcedureChange(event, index) {
    const procedure = this.state.procedure;
    procedure[index] = event.target.value;
    this.setState({ procedure });
  }
  /**
   * Render the createRecipe component
   * 
   * @returns 
   * @memberof CreateRecipe
   */
  render() {

    let createButton = (
      <button data-testid="recipePublish" className="btn btn-primary btn-lg" 
            onClick={this.handleSubmit}>
        Publish Recipe
      </button>
    );

    let updateButton = (
      <button className="btn btn-primary btn-lg" 
          onClick={this.handleUpdate}>
      Update Recipe
    </button>
    );

    if (this.state.loading) {
      updateButton = (
        <button className="btn btn-primary btn-lg" 
                onClick={this.handleUpdate}
                disabled={true}>
            <i className="ion ion-load-d mr-3 loader" style={{ color: 'white' }}></i>
            Updating recipe ...
          </button>
      );
    }

    if (this.state.loading) {
      createButton = (
        <button className="btn btn-primary btn-lg" 
                onClick={this.handleSubmit}
                disabled={true}>
            <i className="ion ion-load-d mr-3 loader" style={{ color: 'white' }}></i>
            Publishing recipe ...
          </button>
      );
    }

    let recipeImage = ( 
        <Dropzone 
          onDrop={this.handleDrop}  
          accept="image/*"
          multiple={false}
          style={dropZoneStyles}
        >
        <div data-testid="upload-image" className="upload-recipe-img">
          <div className="row justify-content-center">
            <div className="col-12">
              <p className="text-center">
                <span className="h2"><i className="ion ion-camera" /></span>
                <br />
                Click to upload image
              </p>
            </div>
          </div>
        </div>
      </Dropzone>
    );

    let ajaxErrors = (
      <small></small>
    );

    if (this.state.ajaxErrors.length > 0) {
      ajaxErrors = this.state.ajaxErrors.map((error, index) => {
        return <small style={this.miniError} key={index}>{error}</small>;
      });
    }
    
    let imageSource;

    if (this.state.imageUrl) {
      imageSource = this.state.imageUrl;
    }

    if (this.state.image || this.state.imageUrl) {
      if (this.state.image) {
        imageSource = this.state.image.preview;
      }

      recipeImage = (
          <Dropzone 
            onDrop={this.handleDrop}  
            accept="image/*"
            multiple={false}
            style={dropZoneStyles}>
            <img className="card-img-top" style={{ height: '450px' }} src={imageSource}/>          
          </Dropzone>
      ); 
    }

    // create an ingredients array
    const ingredientList = this.state.ingredients.map((ingredient, index) => {
            return (  <li key={index} className="list-group-item">
                <div className="input-group">
                <input data-testid={`recipeIngredient-${index}`} className="form-control" placeholder="50 Naira Garri" type="text" name="ingredients" onBlur={event => { this.validateInput(event, index) }} onChange={event => { this.handleIngredientChange(event, index) }}  value={this.state.ingredients[index]} />
                  <span className="input-group-btn">
                    <button data-testid={`recipeIngredient-${index}-trash`} className="btn btn-primary" type="button" onClick={(e) => { this.removeIngredient(index); }}>
                      <i className="ion ion-trash-b" style={{ color: 'white' }}></i>
                    </button>
                  </span>
                </div>
              </li>
            );  
    });
    const procedureList = this.state.procedure.map((step, index) => {
          return (  <li className="list-group-item" key={index}>
                      <div className="row">
                        <div className="col-1 h3">
                          <span className="badge badge-primary">{index + 1}</span>
                        </div>
                        <div className="col-11">
                          <div className="input-group">
                            <input data-testid={`recipeProcedure-${index}`} className="form-control" value={this.state.procedure[index]} onBlur={event => { this.validateInput(event, index) }} name="procedure" onChange={event => { this.handleProcedureChange(event, index) }}  type="text" />
                            <span className="input-group-btn">
                              <button data-testid={`recipeProcedure-${index}-trash`} className="btn btn-primary" type="button" onClick={(e) => { this.removeProcedure(index); }}>
                                <i className="ion ion-trash-b" style={{ color: 'white' }}></i>
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
    });
    // create a procedure array, this one is ordered
    // use react-sortable-hoc plugin for the sorting of the ingredients and procedure arrays
    let titleErrors = <small></small>;
    let imageErrors = <small></small>;
    let timeToCookErrors = <small></small>;
    let descriptionErrors = <small></small>;
    let ingredientsErrors = <small></small>;
    let procedureErrors = <small></small>;
    if (this.state.errors['title'].length > 0) {
      titleErrors = this.state.errors['title'].map((error, index) => {
        return <small style={this.miniError} key={index}>{error}</small>;
      });
    }
    if (this.state.errors['image'].length > 0) {
      imageErrors = this.state.errors['image'].map((error, index) => {
        return <small style={this.miniError} key={index}>{error}</small>;
      });
    } 
    if (this.state.errors['timeToCook'].length > 0) {
      timeToCookErrors = this.state.errors['timeToCook'].map((error, index) => {
        return <small style={this.miniError} key={index}>{error}</small>;
      });
    } 
    if (this.state.errors['description'].length > 0) {
      descriptionErrors = this.state.errors['description'].map((error, index) => {
        return <small style={this.miniError} key={index}>{error}</small>;
      });
    }
    if (this.state.errors['ingredients'].length > 0) {
      ingredientsErrors = this.state.errors['ingredients'].map((error, index) => {
        return <small style={this.miniError} key={index}>{error}<br /></small>;
      });
    } 
    if (this.state.errors['procedure'].length > 0) {
      procedureErrors = this.state.errors['procedure'].map((error, index) => {
        return <small style={this.miniError} key={index}>{error}<br /></small>;
      });
    } 
    return (
      <div>
        <Navbar {...this.props}/>
        <div className="container my-5">
          <div className="row justify-content-center">
            <h1 className="text-center my-5 display-5 header-color">{ this.state.editing ? 'Update your recipe': 'Create a recipe' }</h1>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="card wow fadeInUp">
                {/* Upload recipe image */}
                {recipeImage}
                
                {/* End upload recipe image */}
                <hr />
                <p className="text-center">{ajaxErrors}{imageErrors}  </p>                
                {/* Create recipe form */}
                <div className="card-body">
                  <div className="form-group row">
                    <div className="col-sm-8">
                      <input data-testid="recipeTitle" className="form-control" onBlur={this.validateInput} name="title" value={this.state.title} onChange={this.handleInputChange} placeholder="Recipe title ..." type="text" />
                      {titleErrors}
                    </div>
                    <div className="col-sm-4">
                      <input data-testid="timeToCook" className="form-control" onBlur={this.validateInput} placeholder="How long to cook ?" value={this.state.timeToCook} onChange={this.handleInputChange} type="text" name="timeToCook"/>
                      {timeToCookErrors}
                    </div>
                  </div>
                  <textarea data-testid="recipeDescription" name="description" value={this.state.description} onBlur={this.validateInput} onChange={this.handleInputChange}  placeholder="Tell the world about your recipe ..." cols={3} rows={3} className="form-control"/>
                  {descriptionErrors}
                  <hr />
                  <h3 className="text-muted mb-3 mt-3">
                    <span className="mr-3">Ingredients</span>
                    <span className="text-muted h4 mr-4"> 
                      <i className="ion ion-plus" onClick={this.addNewIngredient} />
                    </span>
                     
                  </h3>
                  {ingredientsErrors}
                  <ul className="list-group">
                    {ingredientList}
                  </ul>
                  <h3 className="text-muted mb-3 mt-3">
                    <span className="mr-4">Procedure</span>
                    <span className="text-muted h4"> 
                      <i className="ion ion-plus" onClick={this.addNewProcedureStep}/> 
                    </span>
                  </h3>
                  {procedureErrors}
                  <ul className="list-group">
                    {procedureList}
                  </ul>
                  <br />
                  <br />
                  <p className="text-center">
                    {this.state.editing ? updateButton : createButton}
                  </p>
                </div>
                {/* End create recipe form */}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
