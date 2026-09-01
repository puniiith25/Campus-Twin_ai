from fastapi import APIRouter
from app.models.what_if import WhatIfRequest, WhatIfResponse
from app.services.what_if_service import what_if_service

router = APIRouter(prefix="/api/what-if", tags=["what-if"])

@router.post("", response_model=WhatIfResponse)
async def what_if_endpoint(request: WhatIfRequest):
    return what_if_service.execute_scenario(request)
