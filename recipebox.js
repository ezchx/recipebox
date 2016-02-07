// data
var data = [];

// recipe
var Recipe = React.createClass({
  render: function() {
    return (
      <div className="recipe">
        <h3 className="recipeName">
          {this.props.name}
        </h3>
      </div>
    );
  }
});


// recipe box
var RecipeBox = React.createClass({
  
  loadRecipesFromServer: function() {
    var storedRecipes = JSON.parse(localStorage["storedRecipes"]);
    this.setState({data: storedRecipes}).bind(this);
  },
    
  handleRecipeSubmit: function(ee) {
    //$("#debug").html("i'm here" + ee.id);
    var storedRecipes = JSON.parse(localStorage["storedRecipes"]);
    if (ee.id === 0) {
      //$("#debug").html("okay");
      var newId = Math.max.apply(null, storedRecipes.map(function(a){return a.id;})) + 1;
    } else {
      var newId = ee.id;
      newId = Number(newId);
      var elementPos = storedRecipes.map(function(x) {return x.id; }).indexOf(newId);
      //$("#debug").html(ee.id + " " + elementPos);
      //$("#debug").html(newId + " " + elementPos);
      storedRecipes.splice(elementPos,1);
    }
    storedRecipes.push({id: newId, name: ee.name, ingredients: ee.ingredients});
    localStorage["storedRecipes"] = JSON.stringify(storedRecipes);
    this.setState({data: storedRecipes}).bind(this);
  },
  
  handleRecipeDelete: function(storedRecipes) {
    this.setState({data: storedRecipes}).bind(this);
  },
  
  
  getInitialState: function() {
    if (localStorage["storedRecipes"] == null) {
      data = [
        {id: 1, name: "Pumpkin Pie", ingredients: "Pumpkin Puree, Sweetened Condensed Milk, Eggs, Pumpkin Pie Spice, Pie Crust"},
        {id: 2, name: "Spaghetti", ingredients: "Noodles, Tomato Sauce (Optional), Meatballs"},
        {id: 3, name: "Onion Pie", ingredients: "Onion, Pie Crust, Sounds Yummy right?"}
      ]; 
      localStorage["storedRecipes"] = JSON.stringify(data); 
    } else {
      return {data: []};
    }
  },
  
  // this is a method called automatically by React after a component is rendered for the first time
  componentDidMount: function() {  
    this.loadRecipesFromServer();
  },  
  
  render: function() {
    return (
      <div className="recipeBox">
        <h1>Recipe Box</h1>
        <RecipeList data={this.state.data} onRecipeDelete={this.handleRecipeDelete} />
        <RecipeForm onRecipeSubmit={this.handleRecipeSubmit}  />
      </div>
    );
  }
});


// recipe list
var RecipeList = React.createClass({
  
  handleClick: function(i) {
    $("#ingred" + i).slideToggle('fast');
  },
  
  handleClick2: function(recipe) {
    $("#ingred" + recipe.id).slideToggle('fast');
    $("#idInput").val(recipe.id);
    $("#recipeInput").val(recipe.name);
    $("#itemInput").val(recipe.ingredients);
    $("#modalTitle").html("Edit Recipe");
  },
  
  
  deleteRecipe: function(i) {
    $("#ingred" + i).slideToggle('fast');
    var storedRecipes = JSON.parse(localStorage["storedRecipes"]);    
    var elementPos = storedRecipes.map(function(x) {return x.id; }).indexOf(i);
    storedRecipes.splice(elementPos,1);
    localStorage["storedRecipes"] = JSON.stringify(storedRecipes);
    this.props.onRecipeDelete(storedRecipes);
  },  
  
  render: function() {
    var recipeNodes = this.props.data.map(function(recipe) {
      return (
        <div>
          <a href="#" onClick={this.handleClick.bind(this, recipe.id)}><Recipe name={recipe.name} key={recipe.id}></Recipe></a>
          <div id={'ingred' + recipe.id}>{recipe.ingredients}
            <div className="smallButton">
              <input type="button" className="btn-sm btn-success eddy" onClick={this.handleClick2.bind(this, recipe)} data-id={recipe.id} data-name={recipe.name} data-ingred={recipe.ingredients} data-toggle="modal" data-target="#myModal" value="Edit" />
              <input type="button" className="btn-sm btn-danger" onClick={this.deleteRecipe.bind(this, recipe.id)} value="Delete" />
            </div>
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div className="recipeList">
        {recipeNodes}
      </div>
    );
  }
});


// recipe form
var RecipeForm = React.createClass({
  getInitialState: function() {
    return {name: '', ingred: ''};
  },  
  
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
    if ($("#idInput").attr('value') != 0) {this.setState({id: $("#idInput").attr('value')});}
    if (this.state.ingred === "") {this.setState({ingred: document.getElementById('itemInput').value});}
    //if (this.state.ingred == null) {this.setState({ingred: $("#itemInput").attr('value')});}
    
  },
  
  handleIngredChange: function(e) {
    this.setState({ingred: e.target.value});
    if ($("#idInput").attr('value') != 0) {this.setState({id: $("#idInput").attr('value')});}
    if (this.state.name === "") {this.setState({name: document.getElementById('recipeInput').value});}    
    //$("#debug").html(this.state.id);
  },
  
  handleClick3: function() {
    $("#recipeInput").val('');
    $("#itemInput").val('');
    $("#modalTitle").html("Add Recipe");
  },  
  
  addRecipe: function(e) {
    if (this.state.id != undefined) {
      var id = this.state.id.trim();
    } else {
      var id = 0;
    }
    id = Number(id);
    //$("#debug").html("hi " + id);
    document.getElementById('idInput').value='';
    var name = this.state.name.trim();
    document.getElementById('recipeInput').value='';
    var ingred = this.state.ingred.trim();
    document.getElementById('itemInput').value='';
    //$("#debug2").html(id + " " + name + " " + ingred);
    this.setState({id: '', name: '', ingred: ''});
    this.props.onRecipeSubmit({id: id, name: name, ingredients: ingred});
  },
  
  render: function() {
    return (
      <div className="recipeForm">
        <div id="button">
          <input type="button" className="btn btn-primary addy" onClick={this.handleClick3} data-toggle="modal" data-target="#myModal" value="Add Recipe" />
        </div>
        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title" id="modalTitle"></h4>
              </div>
              <div className="modal-body">
                <span className="formTitle1">Recipe</span>
                <input type="text" id="recipeInput" className="recNameBox" onChange={this.handleNameChange} placeholder="Enter recipe name" />
                <span className="formTitle2">Ingredients</span>
                <textarea id="itemInput" className="ingrdBox" onChange={this.handleIngredChange} placeholder="Enter ingredients" />
              </div>
              <div className="modal-footer">
                <input type="hidden" id="idInput" value="0" />
                <input type="submit" onClick={this.addRecipe} className="btn btn-primary" data-dismiss="modal" value="Save" />
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


// render
ReactDOM.render(
  <RecipeBox />,
  document.getElementById('content')
);

