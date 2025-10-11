# API Documentation & OpenAPI/Swagger Guide

*Complete guide to automated API documentation generation with OpenAPI/Swagger*

---

## 📚 Overview

This guide covers automated API documentation generation using OpenAPI/Swagger standards. Learn how to generate interactive API docs from your code, integrate with CI/CD, and maintain documentation automatically.

**Benefits**:
- ✅ **Auto-generated** - Documentation stays in sync with code
- ✅ **Interactive** - Test APIs directly in browser
- ✅ **Client SDKs** - Generate client libraries automatically
- ✅ **Validation** - Ensure API spec correctness
- ✅ **Versioning** - Document multiple API versions
- ✅ **Mock Servers** - Test before implementation

---

## 🎯 OpenAPI vs Swagger

**Terminology**:
- **OpenAPI** = The specification standard (formerly Swagger Spec)
- **Swagger** = Tools ecosystem (Swagger UI, Swagger Editor, etc.)
- **OpenAPI 3.x** = Current standard (use this for new projects)
- **Swagger 2.0** = Legacy (avoid for new projects)

---

## 🛠️ Language-Specific Implementation

### Python

#### 1. FastAPI (Built-in OpenAPI)

**Installation**:
```bash
pip install fastapi uvicorn python-multipart
```

**Basic Setup**:
```python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="My API",
    description="API documentation with FastAPI",
    version="1.0.0",
    docs_url="/docs",        # Swagger UI
    redoc_url="/redoc",      # ReDoc
    openapi_url="/openapi.json"
)

class Item(BaseModel):
    """Item model with validation"""
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/", response_model=Item, tags=["items"])
async def create_item(item: Item):
    """
    Create a new item with all the information:

    - **name**: Name of the item (required)
    - **description**: Description of the item (optional)
    - **price**: Price of the item (required)
    - **tax**: Tax amount (optional)
    """
    return item

@app.get("/items/{item_id}", tags=["items"])
async def read_item(item_id: int, q: str | None = None):
    """Get an item by ID"""
    return {"item_id": item_id, "q": q}
```

**Run**:
```bash
uvicorn main:app --reload

# Access documentation:
# Swagger UI: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc
# OpenAPI JSON: http://localhost:8000/openapi.json
```

**Advanced Configuration**:
```python
from fastapi import FastAPI, Header, HTTPException
from fastapi.openapi.utils import get_openapi

app = FastAPI()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="My API",
        version="2.0.0",
        description="This is a custom OpenAPI schema",
        routes=app.routes,
    )

    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        },
        "ApiKey": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

---

#### 2. Flask with Flask-RESTX

**Installation**:
```bash
pip install flask flask-restx
```

**Setup**:
```python
# app.py
from flask import Flask
from flask_restx import Api, Resource, fields

app = Flask(__name__)
api = Api(
    app,
    version='1.0',
    title='My API',
    description='API documentation with Flask-RESTX',
    doc='/docs',
    prefix='/api/v1'
)

# Define namespace
ns = api.namespace('items', description='Item operations')

# Define models
item_model = api.model('Item', {
    'id': fields.Integer(readonly=True, description='Item ID'),
    'name': fields.String(required=True, description='Item name'),
    'price': fields.Float(required=True, description='Item price'),
})

# Mock database
ITEMS = {}

@ns.route('/')
class ItemList(Resource):
    """Shows a list of all items, and lets you POST to add new items"""

    @ns.doc('list_items')
    @ns.marshal_list_with(item_model)
    def get(self):
        """List all items"""
        return list(ITEMS.values())

    @ns.doc('create_item')
    @ns.expect(item_model)
    @ns.marshal_with(item_model, code=201)
    def post(self):
        """Create a new item"""
        new_id = len(ITEMS) + 1
        ITEMS[new_id] = api.payload
        ITEMS[new_id]['id'] = new_id
        return ITEMS[new_id], 201

@ns.route('/<int:id>')
@ns.response(404, 'Item not found')
@ns.param('id', 'The item identifier')
class Item(Resource):
    """Show a single item and lets you delete them"""

    @ns.doc('get_item')
    @ns.marshal_with(item_model)
    def get(self, id):
        """Fetch an item given its identifier"""
        if id not in ITEMS:
            api.abort(404, f"Item {id} doesn't exist")
        return ITEMS[id]

    @ns.doc('delete_item')
    @ns.response(204, 'Item deleted')
    def delete(self, id):
        """Delete an item given its identifier"""
        if id in ITEMS:
            del ITEMS[id]
            return '', 204
        api.abort(404, f"Item {id} doesn't exist")

if __name__ == '__main__':
    app.run(debug=True)
```

**Run**:
```bash
python app.py
# Access: http://localhost:5000/docs
```

---

#### 3. Django REST Framework with drf-spectacular

**Installation**:
```bash
pip install djangorestframework drf-spectacular
```

**Configuration** (`settings.py`):
```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'drf_spectacular',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'My API',
    'DESCRIPTION': 'API documentation with drf-spectacular',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
    },
    'COMPONENT_SPLIT_REQUEST': True
}
```

**URLs** (`urls.py`):
```python
from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # API schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Swagger UI
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # ReDoc
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

**Views with Documentation**:
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

@extend_schema_view(
    list=extend_schema(
        summary="List all items",
        description="Retrieve a list of all items with pagination",
        tags=['items']
    ),
    create=extend_schema(
        summary="Create an item",
        description="Create a new item with provided data",
        tags=['items']
    ),
    retrieve=extend_schema(
        summary="Get item by ID",
        tags=['items']
    ),
)
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    @extend_schema(
        summary="Mark item as featured",
        description="Set featured flag for an item",
        parameters=[
            OpenApiParameter(
                name='featured',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Whether to feature the item',
                required=True
            ),
        ],
        examples=[
            OpenApiExample(
                'Featured example',
                value={'success': True, 'message': 'Item marked as featured'},
                response_only=True,
            ),
        ],
        tags=['items']
    )
    @action(detail=True, methods=['post'])
    def set_featured(self, request, pk=None):
        item = self.get_object()
        featured = request.query_params.get('featured', 'false').lower() == 'true'
        item.featured = featured
        item.save()
        return Response({'success': True, 'message': f'Item {"featured" if featured else "unfeatured"}'})
```

**Generate Schema**:
```bash
python manage.py spectacular --color --file schema.yaml
```

---

### JavaScript/TypeScript

#### 1. NestJS (Built-in Swagger)

**Installation**:
```bash
npm install --save @nestjs/swagger swagger-ui-express
```

**Setup** (`main.ts`):
```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('items')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Export OpenAPI JSON
  const fs = require('fs');
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  await app.listen(3000);
}
bootstrap();
```

**Controller with Decorators**:
```typescript
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';

@ApiTags('items')
@Controller('items')
export class ItemsController {

  @Post()
  @ApiOperation({ summary: 'Create item', description: 'Create a new item with provided data' })
  @ApiResponse({ status: 201, description: 'The item has been created', type: Item })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth()
  create(@Body() createItemDto: CreateItemDto): Item {
    return {
      id: 1,
      ...createItemDto,
      createdAt: new Date(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all items' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all items', type: [Item] })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Item[] {
    return [];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Return the item', type: Item })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findOne(@Param('id') id: string): Item {
    return {
      id: +id,
      name: 'Example',
      price: 100,
      createdAt: new Date(),
    };
  }
}
```

**DTO with Validation**:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Laptop',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the item',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Item description',
    example: 'High-performance laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
```

**Entity**:
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class Item {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Laptop' })
  name: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 'High-performance laptop', required: false })
  description?: string;

  @ApiProperty({ example: '2025-01-11T10:00:00Z' })
  createdAt: Date;
}
```

**Run**:
```bash
npm run start:dev
# Access: http://localhost:3000/api/docs
```

---

#### 2. Express with swagger-jsdoc

**Installation**:
```bash
npm install express swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express
```

**Setup**:
```javascript
// server.js
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation with swagger-jsdoc',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './models/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve OpenAPI JSON
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Item name
 *         price:
 *           type: number
 *           format: float
 *           description: Item price
 *         description:
 *           type: string
 *           description: Item description
 *       example:
 *         id: 1
 *         name: Laptop
 *         price: 999.99
 *         description: High-performance laptop
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: List all items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get('/items', (req, res) => {
  res.json([]);
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
app.post('/items', (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
app.get('/items/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Example', price: 100 });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('API Docs: http://localhost:3000/api/docs');
});
```

---

### PHP

#### 1. Laravel with Laravel OpenAPI (Scramble)

**Installation**:
```bash
composer require dedoc/scramble
```

**Configuration**:
```bash
php artisan vendor:publish --provider="Dedoc\Scramble\ScrambleServiceProvider"
```

**Controller**:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Models\Item;
use Illuminate\Http\JsonResponse;

/**
 * @tags Items
 */
class ItemController extends Controller
{
    /**
     * List all items
     *
     * Get a paginated list of all items in the system.
     *
     * @queryParam page int Page number. Example: 1
     * @queryParam per_page int Items per page. Example: 15
     */
    public function index(): JsonResponse
    {
        $items = Item::paginate(15);
        return response()->json($items);
    }

    /**
     * Create a new item
     *
     * Store a newly created item in the database.
     *
     * @bodyParam name string required The name of the item. Example: Laptop
     * @bodyParam price float required The price of the item. Example: 999.99
     * @bodyParam description string The description of the item. Example: High-performance laptop
     */
    public function store(StoreItemRequest $request): JsonResponse
    {
        $item = Item::create($request->validated());
        return response()->json($item, 201);
    }

    /**
     * Get item by ID
     *
     * Display the specified item.
     *
     * @urlParam id int required The ID of the item. Example: 1
     * @response 200 {"id": 1, "name": "Laptop", "price": 999.99}
     * @response 404 {"message": "Item not found"}
     */
    public function show(Item $item): JsonResponse
    {
        return response()->json($item);
    }

    /**
     * Update an item
     *
     * Update the specified item in the database.
     *
     * @urlParam id int required The ID of the item. Example: 1
     */
    public function update(StoreItemRequest $request, Item $item): JsonResponse
    {
        $item->update($request->validated());
        return response()->json($item);
    }

    /**
     * Delete an item
     *
     * Remove the specified item from the database.
     *
     * @urlParam id int required The ID of the item. Example: 1
     * @response 204
     */
    public function destroy(Item $item): JsonResponse
    {
        $item->delete();
        return response()->json(null, 204);
    }
}
```

**Request Validation**:
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:1000',
        ];
    }
}
```

**Access**:
```bash
php artisan serve
# Access: http://localhost:8000/docs/api
```

---

#### 2. Symfony with NelmioApiDocBundle

**Installation**:
```bash
composer require nelmio/api-doc-bundle
```

**Configuration** (`config/packages/nelmio_api_doc.yaml`):
```yaml
nelmio_api_doc:
    documentation:
        info:
            title: My API
            description: API documentation with Symfony
            version: 1.0.0
        components:
            securitySchemes:
                Bearer:
                    type: http
                    scheme: bearer
                    bearerFormat: JWT
    areas:
        path_patterns:
            - ^/api(?!/doc$)
```

**Controller**:
```php
<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

#[Route('/api')]
#[OA\Tag(name: 'Items')]
class ItemController extends AbstractController
{
    #[Route('/items', methods: ['GET'])]
    #[OA\Get(
        summary: 'List all items',
        description: 'Get a paginated list of all items'
    )]
    #[OA\Parameter(
        name: 'page',
        in: 'query',
        description: 'Page number',
        schema: new OA\Schema(type: 'integer', default: 1)
    )]
    #[OA\Response(
        response: 200,
        description: 'Returns list of items',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Item::class))
        )
    )]
    public function index(): JsonResponse
    {
        return $this->json([]);
    }

    #[Route('/items', methods: ['POST'])]
    #[OA\Post(
        summary: 'Create a new item',
        security: [['Bearer' => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: new Model(type: Item::class))
    )]
    #[OA\Response(
        response: 201,
        description: 'Item created successfully',
        content: new OA\JsonContent(ref: new Model(type: Item::class))
    )]
    public function create(): JsonResponse
    {
        return $this->json(['id' => 1], 201);
    }
}
```

**Access**:
```
# Swagger UI: /api/doc
# OpenAPI JSON: /api/doc.json
```

---

### Go

#### 1. Gin with swaggo/swag

**Installation**:
```bash
go get -u github.com/swaggo/swag/cmd/swag
go get -u github.com/swaggo/gin-swagger
go get -u github.com/swaggo/files
```

**Main file**:
```go
package main

import (
    "github.com/gin-gonic/gin"
    swaggerFiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"

    _ "myapp/docs" // Import generated docs
)

// @title My API
// @version 1.0
// @description API documentation with Gin and Swagger
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

func main() {
    r := gin.Default()

    // API routes
    v1 := r.Group("/api/v1")
    {
        items := v1.Group("/items")
        {
            items.GET("", GetItems)
            items.POST("", CreateItem)
            items.GET("/:id", GetItem)
        }
    }

    // Swagger documentation
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    r.Run(":8080")
}

type Item struct {
    ID          int     `json:"id" example:"1"`
    Name        string  `json:"name" example:"Laptop" binding:"required"`
    Price       float64 `json:"price" example:"999.99" binding:"required"`
    Description string  `json:"description" example:"High-performance laptop"`
}

// GetItems godoc
// @Summary List all items
// @Description Get a list of all items
// @Tags items
// @Accept json
// @Produce json
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Success 200 {array} Item
// @Router /items [get]
func GetItems(c *gin.Context) {
    items := []Item{}
    c.JSON(200, items)
}

// CreateItem godoc
// @Summary Create a new item
// @Description Create a new item with provided data
// @Tags items
// @Accept json
// @Produce json
// @Param item body Item true "Item object"
// @Success 201 {object} Item
// @Failure 400 {object} map[string]string
// @Security ApiKeyAuth
// @Router /items [post]
func CreateItem(c *gin.Context) {
    var item Item
    if err := c.ShouldBindJSON(&item); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    item.ID = 1
    c.JSON(201, item)
}

// GetItem godoc
// @Summary Get item by ID
// @Description Get a specific item by ID
// @Tags items
// @Accept json
// @Produce json
// @Param id path int true "Item ID"
// @Success 200 {object} Item
// @Failure 404 {object} map[string]string
// @Router /items/{id} [get]
func GetItem(c *gin.Context) {
    item := Item{ID: 1, Name: "Laptop", Price: 999.99}
    c.JSON(200, item)
}
```

**Generate docs**:
```bash
swag init
# This creates docs/docs.go, docs/swagger.json, docs/swagger.yaml
```

**Run**:
```bash
go run main.go
# Access: http://localhost:8080/swagger/index.html
```

---

## 🔄 CI/CD Integration

### Generate and Validate OpenAPI Spec

#### GitHub Actions

```yaml
# .github/workflows/api-docs.yml
name: API Documentation

on:
  pull_request:
    paths:
      - 'src/**'
      - 'api/**'
  push:
    branches: [ main ]

jobs:
  validate-openapi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Python (FastAPI)
      - name: Setup Python
        if: contains(github.repository, 'python')
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        if: contains(github.repository, 'python')
        run: |
          pip install fastapi uvicorn

      - name: Generate OpenAPI spec
        if: contains(github.repository, 'python')
        run: |
          python -c "from main import app; import json; print(json.dumps(app.openapi()))" > openapi.json

      # Node.js (NestJS)
      - name: Setup Node.js
        if: contains(github.repository, 'node')
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Generate OpenAPI spec
        if: contains(github.repository, 'node')
        run: |
          npm install
          npm run build
          # NestJS generates openapi.json on startup

      # Validate OpenAPI spec
      - name: Validate OpenAPI
        uses: char0n/swagger-editor-validate@v1
        with:
          definition-file: openapi.json

      # Check for breaking changes
      - name: OpenAPI Breaking Changes
        uses: oasdiff/oasdiff-action@v0.0.15
        with:
          base: https://raw.githubusercontent.com/${{ github.repository }}/main/openapi.json
          revision: openapi.json
          fail-on-diff: true

      # Upload artifact
      - name: Upload OpenAPI spec
        uses: actions/upload-artifact@v3
        with:
          name: openapi-spec
          path: openapi.json

  deploy-docs:
    needs: validate-openapi
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Download OpenAPI spec
        uses: actions/download-artifact@v3
        with:
          name: openapi-spec

      - name: Generate static HTML
        uses: Legion2/swagger-ui-action@v1
        with:
          output: swagger-ui
          spec-file: openapi.json

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./swagger-ui
```

#### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - build
  - deploy

validate:openapi:
  stage: validate
  image: stoplight/spectral:latest
  script:
    # Generate OpenAPI spec (example for FastAPI)
    - pip install fastapi uvicorn
    - python -c "from main import app; import json; print(json.dumps(app.openapi()))" > openapi.json

    # Validate with Spectral
    - spectral lint openapi.json

    # Check for breaking changes
    - |
      if [ "$CI_COMMIT_BRANCH" != "$CI_DEFAULT_BRANCH" ]; then
        curl -o openapi-main.json "https://gitlab.com/${CI_PROJECT_PATH}/-/raw/${CI_DEFAULT_BRANCH}/openapi.json"
        npx @openapitools/openapi-generator-cli validate -i openapi.json
      fi
  artifacts:
    paths:
      - openapi.json
    expire_in: 1 week

build:docs:
  stage: build
  image: node:18
  dependencies:
    - validate:openapi
  script:
    - npm install -g redoc-cli
    - redoc-cli bundle openapi.json -o api-docs.html
  artifacts:
    paths:
      - api-docs.html

deploy:pages:
  stage: deploy
  dependencies:
    - build:docs
  script:
    - mkdir -p public
    - cp api-docs.html public/index.html
    - cp openapi.json public/
  artifacts:
    paths:
      - public
  only:
    - main
```

---

## 📊 Documentation Hosting Options

### 1. GitHub Pages

```bash
# Build static documentation
npx redoc-cli bundle openapi.json -o index.html

# Create gh-pages branch
git checkout --orphan gh-pages
git add index.html
git commit -m "docs: add API documentation"
git push origin gh-pages

# Enable in repository settings
# Settings → Pages → Source: gh-pages branch
```

### 2. GitLab Pages

```yaml
# .gitlab-ci.yml
pages:
  stage: deploy
  script:
    - mkdir -p public
    - npx redoc-cli bundle openapi.json -o public/index.html
  artifacts:
    paths:
      - public
  only:
    - main
```

### 3. Self-Hosted with Docker

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  swagger-ui:
    image: swaggerapi/swagger-ui:latest
    ports:
      - "8080:8080"
    environment:
      SWAGGER_JSON_URL: http://localhost:3000/openapi.json
    volumes:
      - ./openapi.json:/usr/share/nginx/html/openapi.json

  redoc:
    image: redocly/redoc:latest
    ports:
      - "8081:80"
    environment:
      SPEC_URL: http://localhost:3000/openapi.json
    volumes:
      - ./openapi.json:/usr/share/nginx/html/openapi.json
```

---

## 🛠️ Advanced Tools

### 1. Client SDK Generation

**OpenAPI Generator**:
```bash
# Install
npm install -g @openapitools/openapi-generator-cli

# Generate Python client
openapi-generator-cli generate \
  -i openapi.json \
  -g python \
  -o ./clients/python

# Generate TypeScript client
openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o ./clients/typescript

# Generate Go client
openapi-generator-cli generate \
  -i openapi.json \
  -g go \
  -o ./clients/go
```

### 2. Mock Server

**Prism (OpenAPI Mock Server)**:
```bash
# Install
npm install -g @stoplight/prism-cli

# Run mock server
prism mock openapi.json

# Access mock API: http://localhost:4010
```

### 3. API Testing

**Dredd (API Testing)**:
```bash
# Install
npm install -g dredd

# Test API against spec
dredd openapi.json http://localhost:3000
```

---

## 📋 Best Practices

### 1. **Keep Spec in Sync with Code**
- ✅ Generate from code annotations (preferred)
- ✅ Validate in CI/CD pipeline
- ✅ Block PRs with breaking changes
- ❌ Don't manually write OpenAPI YAML

### 2. **Versioning Strategy**
```
/api/v1/items    → Version 1
/api/v2/items    → Version 2 (new features)

# Document both versions
/docs/v1         → V1 docs
/docs/v2         → V2 docs
```

### 3. **Security Documentation**
```yaml
# Always document authentication
securitySchemes:
  BearerAuth:
    type: http
    scheme: bearer
  ApiKeyAuth:
    type: apiKey
    in: header
    name: X-API-Key
```

### 4. **Error Responses**
```yaml
# Document all error codes
responses:
  200:
    description: Success
  400:
    description: Bad request
  401:
    description: Unauthorized
  403:
    description: Forbidden
  404:
    description: Not found
  500:
    description: Server error
```

### 5. **Examples**
```yaml
# Provide realistic examples
examples:
  example1:
    summary: Basic item
    value:
      name: Laptop
      price: 999.99
  example2:
    summary: Item with description
    value:
      name: Laptop
      price: 999.99
      description: High-performance laptop
```

---

## ✅ Checklist: API Documentation Setup

### Initial Setup
- [ ] Choose framework-appropriate tool
- [ ] Install dependencies
- [ ] Configure OpenAPI metadata (title, version, description)
- [ ] Add security schemes
- [ ] Set up local docs endpoint

### Documentation
- [ ] Document all endpoints with summaries
- [ ] Add parameter descriptions
- [ ] Document request bodies with examples
- [ ] Document all response codes
- [ ] Add realistic examples
- [ ] Document authentication requirements

### CI/CD Integration
- [ ] Generate OpenAPI spec in pipeline
- [ ] Validate spec format
- [ ] Check for breaking changes
- [ ] Deploy to hosting platform
- [ ] Upload spec as artifact

### Advanced
- [ ] Generate client SDKs
- [ ] Set up mock server for testing
- [ ] Add API testing (Dredd, Postman)
- [ ] Version API documentation
- [ ] Add changelog for API changes

---

## 🔗 Resources

### Tools
- **Swagger UI**: https://swagger.io/tools/swagger-ui/
- **ReDoc**: https://github.com/Redocly/redoc
- **OpenAPI Generator**: https://openapi-generator.tech/
- **Prism Mock Server**: https://stoplight.io/open-source/prism
- **Spectral Linting**: https://stoplight.io/open-source/spectral

### Documentation
- **OpenAPI Specification**: https://spec.openapis.org/oas/latest.html
- **Swagger Guide**: https://swagger.io/docs/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **NestJS Swagger**: https://docs.nestjs.com/openapi/introduction

### Validators
- **Swagger Editor**: https://editor.swagger.io/
- **OpenAPI Diff**: https://github.com/OpenAPITools/openapi-diff
- **Spectral**: https://stoplight.io/open-source/spectral

---

*Keep your API documentation automated and always in sync with your code!* 🚀
