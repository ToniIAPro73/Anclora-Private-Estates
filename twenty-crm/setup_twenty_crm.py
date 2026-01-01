#!/usr/bin/env python3
"""
TWENTY CRM SETUP AUTOMATION
Anclora Private Estates

Script para configuración automatizada de campos custom, pipelines y automation rules.
"""

import requests
import json
import os
from typing import Dict, List, Any
from datetime import datetime

# Configuration
TWENTY_API_URL = os.getenv("TWENTY_CRM_API_URL", "https://twenty.ancloraprivateestates.com/api/rest")
API_KEY = os.getenv("TWENTY_CRM_API_KEY")
WORKSPACE_ID = os.getenv("TWENTY_CRM_WORKSPACE_ID")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# ======================
# CONTACT CUSTOM FIELDS
# ======================

CONTACT_FIELDS = [
    # Lead Management
    {
        "name": "leadSource",
        "type": "select",
        "label": "Fuente del Lead",
        "description": "Origin of the lead",
        "options": [
            "Website - Contacto General",
            "Website - Property Inquiry",
            "Website - Valuation Request",
            "Website - Consultation",
            "Referral - Client",
            "Referral - Partner",
            "Facebook Ads",
            "Google Ads",
            "LinkedIn",
            "Instagram",
            "Direct Call",
            "Walk-in",
            "Event/Networking",
            "Other"
        ],
        "required": True
    },
    {
        "name": "leadScore",
        "type": "number",
        "label": "Lead Score",
        "description": "Algorithmic lead scoring (0-100)",
        "min": 0,
        "max": 100,
        "defaultValue": 0
    },
    {
        "name": "leadStatus",
        "type": "select",
        "label": "Estado del Lead",
        "options": [
            "new",
            "contacted",
            "qualified",
            "proposal",
            "negotiation",
            "won",
            "lost",
            "nurturing"
        ],
        "defaultValue": "new",
        "required": True
    },
    {
        "name": "leadClassification",
        "type": "select",
        "label": "Clasificación",
        "description": "Based on lead scoring algorithm",
        "options": ["hot", "warm", "cold"],
        "required": True
    },
    
    # Property Interest
    {
        "name": "interestedPropertyType",
        "type": "multi-select",
        "label": "Tipos de Propiedad Interesados",
        "options": [
            "Villa",
            "Apartment",
            "Penthouse",
            "Estate/Finca",
            "Land",
            "Commercial"
        ]
    },
    {
        "name": "interestedPropertyId",
        "type": "text",
        "label": "Property ID Consulted",
        "description": "Last property they inquired about"
    },
    {
        "name": "preferredLocations",
        "type": "multi-select",
        "label": "Ubicaciones Preferidas",
        "options": [
            "Son Vida",
            "Palma Centro",
            "Paseo Marítimo",
            "Port d'Andratx",
            "Valldemossa",
            "Deià",
            "Sóller",
            "Pollensa",
            "Alcúdia",
            "Santa Ponsa",
            "Other"
        ]
    },
    {
        "name": "budgetRange",
        "type": "select",
        "label": "Rango de Presupuesto",
        "options": [
            "Under €500K",
            "€500K - €1M",
            "€1M - €2M",
            "€2M - €5M",
            "Over €5M",
            "Not Disclosed"
        ]
    },
    {
        "name": "timeline",
        "type": "select",
        "label": "Timeline de Compra",
        "options": [
            "Immediate (0-1 month)",
            "Short-term (1-3 months)",
            "Medium-term (3-6 months)",
            "Long-term (6-12 months)",
            "Exploring (12+ months)",
            "Not Disclosed"
        ]
    },
    
    # Client Profile
    {
        "name": "clientType",
        "type": "select",
        "label": "Tipo de Cliente",
        "options": [
            "Buyer",
            "Seller",
            "Both",
            "Investor",
            "Renter",
            "Landlord"
        ],
        "required": True
    },
    {
        "name": "nationality",
        "type": "text",
        "label": "Nacionalidad"
    },
    {
        "name": "language",
        "type": "select",
        "label": "Idioma Preferido",
        "options": ["Spanish", "English", "German", "French", "Other"],
        "defaultValue": "Spanish"
    },
    {
        "name": "netWorthCategory",
        "type": "select",
        "label": "Categoría Patrimonial",
        "options": [
            "HNWI (€1M-€5M)",
            "VHNWI (€5M-€30M)",
            "UHNWI (€30M+)",
            "Not Disclosed"
        ],
        "description": "High/Very High/Ultra High Net Worth Individual"
    },
    
    # Request Information
    {
        "name": "requestType",
        "type": "select",
        "label": "Tipo de Solicitud",
        "options": [
            "General Inquiry",
            "Property Viewing",
            "Valuation",
            "Consultation",
            "Investment Advice",
            "Property Management"
        ]
    },
    {
        "name": "initialMessage",
        "type": "long-text",
        "label": "Mensaje Inicial",
        "description": "First message from contact form"
    },
    {
        "name": "propertyToSell",
        "type": "text",
        "label": "Propiedad a Vender",
        "description": "For valuation/selling requests"
    },
    
    # Communication
    {
        "name": "preferredContactMethod",
        "type": "select",
        "label": "Método de Contacto Preferido",
        "options": ["Email", "Phone", "WhatsApp", "Video Call"],
        "defaultValue": "Email"
    },
    {
        "name": "whatsapp",
        "type": "phone",
        "label": "WhatsApp"
    },
    {
        "name": "lastContactedAt",
        "type": "datetime",
        "label": "Último Contacto",
        "description": "Last time we reached out"
    },
    {
        "name": "nextFollowUpAt",
        "type": "datetime",
        "label": "Próximo Follow-up"
    },
    
    # GDPR & Compliance
    {
        "name": "gdprConsent",
        "type": "checkbox",
        "label": "Consentimiento GDPR",
        "description": "Privacy policy accepted",
        "required": True,
        "defaultValue": False
    },
    {
        "name": "marketingConsent",
        "type": "checkbox",
        "label": "Consentimiento Marketing",
        "description": "Accepts marketing communications",
        "defaultValue": False
    },
    {
        "name": "dataSource",
        "type": "text",
        "label": "Data Source",
        "description": "Original data capture source/URL"
    }
]

# ======================
# DEAL CUSTOM FIELDS
# ======================

DEAL_FIELDS = [
    {
        "name": "dealType",
        "type": "select",
        "label": "Tipo de Deal",
        "options": ["Purchase", "Sale", "Rental", "Property Management"],
        "required": True
    },
    {
        "name": "propertyId",
        "type": "text",
        "label": "Property ID",
        "description": "Reference to property in catalog"
    },
    {
        "name": "propertyAddress",
        "type": "text",
        "label": "Dirección Propiedad"
    },
    {
        "name": "askingPrice",
        "type": "currency",
        "label": "Precio de Salida",
        "currency": "EUR"
    },
    {
        "name": "offerPrice",
        "type": "currency",
        "label": "Precio Ofertado",
        "currency": "EUR"
    },
    {
        "name": "finalPrice",
        "type": "currency",
        "label": "Precio Final",
        "currency": "EUR",
        "description": "Actual closing price"
    },
    {
        "name": "commission",
        "type": "currency",
        "label": "Comisión",
        "currency": "EUR"
    },
    {
        "name": "commissionPercentage",
        "type": "number",
        "label": "% Comisión",
        "min": 0,
        "max": 100,
        "suffix": "%"
    },
    {
        "name": "dealPriority",
        "type": "select",
        "label": "Prioridad",
        "options": ["Low", "Medium", "High", "Critical"],
        "defaultValue": "Medium"
    },
    {
        "name": "lostReason",
        "type": "select",
        "label": "Motivo Pérdida",
        "options": [
            "Price too high",
            "Chose competitor",
            "Financing fell through",
            "Property sold",
            "Client changed mind",
            "No response",
            "Other"
        ]
    }
]

# ======================
# PIPELINE STAGES
# ======================

DEAL_PIPELINE = {
    "name": "Sales Pipeline - Anclora",
    "stages": [
        {"name": "New Lead", "probability": 10, "color": "#9CA3AF"},
        {"name": "Contacted", "probability": 20, "color": "#3B82F6"},
        {"name": "Qualified", "probability": 40, "color": "#8B5CF6"},
        {"name": "Property Viewing", "probability": 60, "color": "#EC4899"},
        {"name": "Proposal Sent", "probability": 70, "color": "#F59E0B"},
        {"name": "Negotiation", "probability": 80, "color": "#EF4444"},
        {"name": "Won", "probability": 100, "color": "#10B981"},
        {"name": "Lost", "probability": 0, "color": "#6B7280"}
    ]
}

# ======================
# FUNCTIONS
# ======================

def create_custom_field(object_type: str, field_config: Dict[str, Any]) -> Dict[str, Any]:
    """Create a custom field in Twenty CRM"""
    url = f"{TWENTY_API_URL}/metadata/objects/{object_type}/fields"
    
    try:
        response = requests.post(url, json=field_config, headers=HEADERS)
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e)}

def create_pipeline(pipeline_config: Dict[str, Any]) -> Dict[str, Any]:
    """Create a deal pipeline"""
    url = f"{TWENTY_API_URL}/pipelines"
    
    try:
        response = requests.post(url, json=pipeline_config, headers=HEADERS)
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e)}

def verify_api_connection() -> bool:
    """Verify API connection and credentials"""
    url = f"{TWENTY_API_URL}/workspace"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        print("✓ API connection verified")
        return True
    except requests.exceptions.RequestException as e:
        print(f"✗ API connection failed: {e}")
        return False

def setup_contact_fields():
    """Setup all contact custom fields"""
    print("\n" + "="*60)
    print("SETTING UP CONTACT CUSTOM FIELDS")
    print("="*60)
    
    success_count = 0
    error_count = 0
    
    for field in CONTACT_FIELDS:
        print(f"\nCreating field: {field['label']} ({field['name']})...", end=" ")
        result = create_custom_field("contact", field)
        
        if result["success"]:
            print("✓")
            success_count += 1
        else:
            print(f"✗ Error: {result['error']}")
            error_count += 1
    
    print(f"\n✓ Contact fields: {success_count} created, {error_count} errors")
    return success_count, error_count

def setup_deal_fields():
    """Setup all deal custom fields"""
    print("\n" + "="*60)
    print("SETTING UP DEAL CUSTOM FIELDS")
    print("="*60)
    
    success_count = 0
    error_count = 0
    
    for field in DEAL_FIELDS:
        print(f"\nCreating field: {field['label']} ({field['name']})...", end=" ")
        result = create_custom_field("deal", field)
        
        if result["success"]:
            print("✓")
            success_count += 1
        else:
            print(f"✗ Error: {result['error']}")
            error_count += 1
    
    print(f"\n✓ Deal fields: {success_count} created, {error_count} errors")
    return success_count, error_count

def setup_pipeline():
    """Setup deal pipeline"""
    print("\n" + "="*60)
    print("SETTING UP DEAL PIPELINE")
    print("="*60)
    
    print(f"\nCreating pipeline: {DEAL_PIPELINE['name']}...", end=" ")
    result = create_pipeline(DEAL_PIPELINE)
    
    if result["success"]:
        print("✓")
        return True
    else:
        print(f"✗ Error: {result['error']}")
        return False

def export_config():
    """Export configuration to JSON file"""
    config = {
        "timestamp": datetime.now().isoformat(),
        "workspace_id": WORKSPACE_ID,
        "contact_fields": CONTACT_FIELDS,
        "deal_fields": DEAL_FIELDS,
        "pipeline": DEAL_PIPELINE
    }
    
    filename = f"twenty_crm_config_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Configuration exported to: {filename}")

# ======================
# MAIN
# ======================

def main():
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║       TWENTY CRM SETUP AUTOMATION                          ║
    ║       Anclora Private Estates                              ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    # Verify environment variables
    if not API_KEY:
        print("✗ Error: TWENTY_CRM_API_KEY not set")
        return
    
    if not WORKSPACE_ID:
        print("✗ Error: TWENTY_CRM_WORKSPACE_ID not set")
        return
    
    print(f"API URL: {TWENTY_API_URL}")
    print(f"Workspace: {WORKSPACE_ID}")
    
    # Verify connection
    if not verify_api_connection():
        print("\n✗ Setup aborted due to connection failure")
        return
    
    # Confirm
    print("\nThis will create the following:")
    print(f"  - {len(CONTACT_FIELDS)} Contact custom fields")
    print(f"  - {len(DEAL_FIELDS)} Deal custom fields")
    print(f"  - 1 Deal pipeline with {len(DEAL_PIPELINE['stages'])} stages")
    
    confirm = input("\nProceed? (yes/no): ").strip().lower()
    
    if confirm != "yes":
        print("✗ Setup cancelled")
        return
    
    # Setup
    contact_success, contact_errors = setup_contact_fields()
    deal_success, deal_errors = setup_deal_fields()
    pipeline_success = setup_pipeline()
    
    # Summary
    print("\n" + "="*60)
    print("SETUP SUMMARY")
    print("="*60)
    print(f"Contact fields: {contact_success} created, {contact_errors} errors")
    print(f"Deal fields: {deal_success} created, {deal_errors} errors")
    print(f"Pipeline: {'✓ Created' if pipeline_success else '✗ Failed'}")
    
    # Export config
    export_config()
    
    print("\n✓ Setup completed!")
    print("\nNext steps:")
    print("  1. Review fields in Twenty CRM UI")
    print("  2. Configure field permissions")
    print("  3. Test n8n integration")
    print("  4. Train team on new fields")

if __name__ == "__main__":
    main()
