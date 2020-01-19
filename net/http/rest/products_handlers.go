package rest

import (
	"net/http"

	"github.com/deliriumproducts/aumo"
)

func (rest *Rest) productsHandler(w http.ResponseWriter, r *http.Request) {
	products, err := rest.productService.Products()
	if err != nil {
		rest.JSONError(w, err, http.StatusNotFound)
		return
	}

	rest.JSON(w, products, http.StatusOK)
}

func (rest *Rest) productCreateHandler(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Name        string  `form:"name" validate:"required"`
		Image       string  `form:"image" validate:"required,url"`
		Price       float64 `form:"price" validate:"required,numeric"`
		Description string  `form:"description" validate:"required"`
		Stock       uint    `form:"stock" validate:"required,numeric"`
	}
	var npf request
	if ok := rest.Form(w, r, &npf); !ok {
		return
	}

	product := aumo.NewProduct(npf.Name, npf.Price, npf.Image, npf.Description, npf.Stock)

	err := rest.productService.Create(product)
	if err != nil {
		rest.JSONError(w, err, http.StatusInternalServerError)
		return
	}

	rest.JSON(w, product, http.StatusOK)
}