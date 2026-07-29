import os

def generate_sample_documents(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    
    # Try reportlab if installed
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        # 1. Metformin API PDF
        pdf1_path = os.path.join(output_dir, "Metformin_Hydrochloride_API_Complaint.pdf")
        doc1 = SimpleDocTemplate(pdf1_path, pagesize=letter)
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontSize=18, textColor=colors.HexColor("#1e3a8a"), spaceAfter=12)
        body_style = ParagraphStyle('DocBody', parent=styles['Normal'], fontSize=10, leading=14, textColor=colors.HexColor("#334155"))
        
        story = []
        story.append(Paragraph("QUALITY DEFECT & CUSTOMER COMPLAINT FORM", title_style))
        story.append(Paragraph("<b>Origin:</b> Hexagon Pharmaceuticals Quality Assurance Department", body_style))
        story.append(Paragraph("<b>Complaint Source:</b> External Customer Audit / QA Notification", body_style))
        story.append(Paragraph("<b>Customer Name:</b> Hexagon Pharma Ltd", body_style))
        story.append(Paragraph("<b>Complaint Date:</b> 2026-07-24", body_style))
        story.append(Spacer(1, 10))
        
        data1 = [
            ["Parameter", "Details"],
            ["Product Name", "Metformin Hydrochloride API"],
            ["Product Strength / Grade", "IP/BP Grade"],
            ["Batch / Lot Number", "MFH 26 C-H-G-2-6-0-7-1-2-A"],
            ["Manufacturing Date", "2026-01-15"],
            ["Expiry Date", "2029-01-14"],
            ["Quantity Affected", "100 kilograms (4 HDPE drums)"],
            ["Complaint Type", "Out of Specification - Impurity Level / Appearance"]
        ]
        
        t1 = Table(data1, colWidths=[200, 300])
        t1.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#0f172a")),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t1)
        story.append(Spacer(1, 15))
        story.append(Paragraph("<b>Detailed Complaint Description:</b>", body_style))
        story.append(Paragraph("During receiving inspection at Hexagon Pharma facility, Batch MFH 26 C-H-G-2-6-0-7-1-2-A of Metformin Hydrochloride API exhibited off-white crystalline clump formation with elevated related substance impurity levels (0.35% vs specification max 0.10%). Two HDPE drums show moisture ingress around inner liner seals.", body_style))
        doc1.build(story)

        # 2. Amoxicillin PDF
        pdf2_path = os.path.join(output_dir, "Amoxicillin_Capsules_Discoloration_Apollo.pdf")
        doc2 = SimpleDocTemplate(pdf2_path, pagesize=letter)
        story2 = []
        story2.append(Paragraph("CUSTOMER COMPLAINT INTAKE REPORT - APOLLO PHARMACY", title_style))
        story2.append(Paragraph("<b>Complaint Source:</b> Apollo Pharmacy Regional Distribution Depot", body_style))
        story2.append(Paragraph("<b>Customer Name:</b> Apollo Pharmacy", body_style))
        story2.append(Paragraph("<b>Complaint Date:</b> 2026-07-28", body_style))
        story2.append(Spacer(1, 10))
        data2 = [
            ["Parameter", "Details"],
            ["Product Name", "Amoxicillin Capsules"],
            ["Product Strength", "500 mg"],
            ["Batch / Lot Number", "AMX240899"],
            ["Manufacturing Date", "2026-02-10"],
            ["Expiry Date", "2028-02-09"],
            ["Quantity Affected", "100 capsules (2 blister packs)"],
            ["Complaint Type", "Physical Discoloration Defect"]
        ]
        t2 = Table(data2, colWidths=[200, 300])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#0f172a")),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story2.append(t2)
        story2.append(Spacer(1, 15))
        story2.append(Paragraph("<b>Detailed Complaint Description:</b>", body_style))
        story2.append(Paragraph("Apollo Pharmacy reported discolored capsules in Amoxicillin capsules 500 milligrams. Several capsules in blister packs showed dark brown spotting on gelatin shell.", body_style))
        doc2.build(story2)
        return [pdf1_path, pdf2_path]

    except Exception:
        # Fallback TXT files if reportlab is not installed
        txt1_path = os.path.join(output_dir, "Metformin_Hydrochloride_API_Complaint.txt")
        with open(txt1_path, "w", encoding="utf-8") as f:
            f.write("""QUALITY DEFECT & CUSTOMER COMPLAINT FORM
Origin: Hexagon Pharmaceuticals Quality Assurance Department
Complaint Source: External Customer Audit / QA Notification
Customer Name: Hexagon Pharma Ltd
Complaint Date: 2026-07-24

Product Name: Metformin Hydrochloride API
Product Strength / Grade: IP/BP Grade
Batch / Lot Number: MFH 26 C-H-G-2-6-0-7-1-2-A
Manufacturing Date: 2026-01-15
Expiry Date: 2029-01-14
Quantity Affected: 100 kilograms (4 HDPE drums)
Complaint Type: Out of Specification - Impurity Level / Appearance

Detailed Complaint Description:
During receiving inspection at Hexagon Pharma facility, Batch MFH 26 C-H-G-2-6-0-7-1-2-A of Metformin Hydrochloride API exhibited off-white crystalline clump formation with elevated related substance impurity levels (0.35% vs max 0.10%). Two HDPE drums show moisture ingress around inner liner seals.
""")
        return [txt1_path]

if __name__ == "__main__":
    generate_sample_documents(".")
